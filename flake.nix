{
  description = "CTP/IP son-console 10.0.0, the canonical engine, deterministic build";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        nodejs = pkgs.nodejs_22;
        npm = pkgs.nodejs_22.pkgs.npm;
        
        # Expected canonical SHA-256 of engine.mjs
        expectedSha256 = "8ef255239ab6471c107601ffcc03e4b05dc0103fe76494b86f330747b0c0831e";
      in
      {
        packages.engine = pkgs.stdenv.mkDerivation {
          pname = "son-console-engine";
          version = "10.0.0";
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
            echo "CTP/IP son-console 10.0.0 development shell"
            echo "Canonical formula: Γ = (E × V × A) / (τ + ε₀)"
            echo "Node.js: $(node --version)"
            echo "npm: $(npm --version)"
          '';
        };
      });
}