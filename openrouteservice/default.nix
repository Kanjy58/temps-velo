{ lib, buildPythonPackage, fetchPypi, requests, coverage, coveralls, responses, nose }:

buildPythonPackage rec {
  pname = "openrouteservice";
  version = "2.2.3";

  src = fetchPypi {
    inherit pname version;
    sha256 = "0sfpwfbzw64p462qp3a1p402h33ilch6ma991s80d6ni37nfxyzz";
  };

  # doCheck = false;

  checkInputs = [
    coverage
    coveralls
    responses
    nose
  ];

  propagatedBuildInputs = [
    requests
  ];

  checkPhase = "nosetests -v";
  doCheck = false; # ModuleNotFoundError: No module named 'test.test_helper'

  meta = {
    homepage = "https://github.com/GIScience/openrouteservice-py";
    description = "The Python API to consume openrouteservice(s) painlessly!";
    license = with lib.licenses; asl20;
  };
}
