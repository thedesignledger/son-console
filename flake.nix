{
  description = "CTP/IP Son Console Kernel v9.0.0 - Deterministic Build";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        nodejs = pkgs.nodejs_20;
        npm = pkgs.nodejs_20.pkgs.npm;
        
        # Expected canonical SHA-256 of engine.mjs
        expectedSha256 = "040e14ea0a11ec3565f7994e6b5ae7054b67194438c0cc5fa551d38fc98880f1";
      in
      {
        packages.engine = pkgs.stdenv.mkDerivation {
          pname = "son-console-engine";
          version = "9.0.0";
          src = ./.;
          
          buildInputs = [ nodejs npm ];
          
          buildPhase = ''
            export HOME=$(mktemp -d)
            # Install dependencies if package.json exists
            if [ -f package.json ]; then
              npm ci --frozen-lockfile 2>/dev/null || npm install
            fi
            # Run build if script exists, otherwise use source as-is
            npm run build 2>/dev/null || echo "No build script, using source engine.mjs"
          '';
          
          installPhase = ''
            mkdir -p $out
            cp engine.mjs $out/
          '';
          
          checkPhase = ''
            # Verify SHA-256 matches canonical hash
            actual_sha=$(sha256sum engine.mjs | cut -d' ' -f1)
            if [ "$actual_sha" != "${expectedSha256}" ]; then
              echo "ERROR: SHA-256 mismatch!"
              echo "Expected: ${expectedSha256}"
              echo "Actual:   $actual_sha"
              exit 1
            fi
            echo "✓ SHA-256 verification passed: $actual_sha"
          '';
          
          doCheck = true;
          
          meta = with pkgs.lib; {
            description = "CTP/IP Son Console Engine - Canonical Genesis ΔΣ₀Γ";
            license = licenses.unfree; # CC-BY-NC 4.0 + Commercial via Design Ledger
            platforms = platforms.all;
          };
        };
        
        packages.default = self.packages.${system}.engine;
        
        devShells.default = pkgs.mkShell {
          buildInputs = [ nodejs npm ];
          shellHook = ''
            echo "CTP/IP Son Console Kernel v9.0.0 Development Shell"
            echo "Canonical formula: Γ = (E × V × A) / (τ + ε₀)"
            echo "Node.js: $(node --version)"
            echo "npm: $(npm --version)"
          '';
        };
      });
}