self: super: {
  python3 = super.python3.override {
    packageOverrides = self: super: {
      openrouteservice = super.callPackage ./openrouteservice-py.nix {};
    };
  };
}
