{ pkgs ? import <nixpkgs> { overlays = [ (import ./overlay.nix) ]; } }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    gawk
    linkchecker
    minify
    openssl
    (python3.withPackages (ps: with ps; [
      openrouteservice
      pandas
      requests
      scipy
    ]))
  ];

  shellHook = ''
    unset PYTHONPATH
  '';
}
