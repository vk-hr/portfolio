{
  description = "portfolio dev shell";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { nixpkgs, ... }:
    let
      # x86_64-darwin omitted: nixpkgs 26.11+ dropped support for it.
      forAllSystems = nixpkgs.lib.genAttrs [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];
    in
    {
      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          # Biome comes from the @biomejs/biome npm devDependency.
          # `bun lint` needs Bun >= 1.4.5; it arrives via `nix flake update`
          # once nixpkgs bumps bun.
          default = pkgs.mkShell {
            packages = [
              pkgs.bun
              pkgs.hk
            ];
            # Git hooks from hk.pkl: pre-commit formats and lints staged files,
            # pre-push runs the CI checks. Installed on every shell entry
            # (idempotent) so no clone, human or agent, skips them.
            shellHook = ''
              hk install >/dev/null 2>&1 || echo "warning: hk install failed; git hooks are not active" >&2
            '';
          };
        }
      );
    };
}
