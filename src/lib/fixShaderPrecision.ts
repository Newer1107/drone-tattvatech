import * as THREE from "three";

/**
 * Patches a MeshStandardMaterial's compiled fragment shader to clamp
 * `Ems` (energy-missing-single-scatter) to `[0, 1]` instead of leaving
 * it unbounded.
 *
 * ## Root cause of X4122
 *
 * The DFG LUT (`dfgLUT` texture) stores pre-integrated specular BRDF
 * values where `fab.x + fab.y ≤ 1.0` by construction.  However, GPU
 * bilinear interpolation across LUT texels can return samples where
 * `fab.x + fab.y` *very slightly* exceeds 1.0 (~10⁻¹⁷ over).  This
 * makes `Ems = 1.0 - (fab.x + fab.y)` a negative denormal.
 *
 * When this denormal is later multiplied by `Favg` (which can be ≈ 1.0
 * for metals with white base colour) and subtracted from 1.0:
 *
 *     Fms = FssEss * Favg / (1.0 - Ems * Favg)
 *
 * the compiler emits X4122 because adding `≈10⁻¹⁷` to `≈1.0` has no
 * effect in float32 (the result is just `1.0f`).
 *
 * ## Fix
 *
 * Clamping Ems to `max(0.0, …)` is physically correct — energy
 * remaining after single scattering cannot be negative.
 */
export function fixMeshStandardPrecision(material: THREE.Material): void {
  if (!(material instanceof THREE.MeshStandardMaterial)) return;

  const originalHook = material.onBeforeCompile;

  material.onBeforeCompile = (shader, renderer) => {
    // Patch every `1.0 - Ess` that computes remaining energy.
    // The three expressions live in `computeMultiscattering` and
    // `BRDF_GGX_Multiscatter` in `lights_physical_pars_fragment.glsl.js`.
    shader.fragmentShader = shader.fragmentShader
      .replace(
        /float\s+Ems\s*=\s*1\.0\s*-\s*Ess;/g,
        "float Ems = max(0.0, 1.0 - Ess);",
      )
      .replace(
        /float\s+Ems_V\s*=\s*1\.0\s*-\s*Ess_V;/g,
        "float Ems_V = max(0.0, 1.0 - Ess_V);",
      )
      .replace(
        /float\s+Ems_L\s*=\s*1\.0\s*-\s*Ess_L;/g,
        "float Ems_L = max(0.0, 1.0 - Ess_L);",
      );

    if (originalHook) originalHook.call(material, shader, renderer);
  };
}

/**
 * Apply `fixMeshStandardPrecision` to every MeshStandardMaterial
 * reachable from a Three.js Object3D (scene / group / mesh).
 */
export function fixAllMaterials(root: THREE.Object3D): void {
  root.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      const mat = node.material;
      if (Array.isArray(mat)) {
        mat.forEach(fixMeshStandardPrecision);
      } else {
        fixMeshStandardPrecision(mat);
      }
    }
  });
}
