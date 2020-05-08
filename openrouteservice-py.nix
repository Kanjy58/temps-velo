{ lib, buildPythonPackage, fetchPypi, requests, coverage, coveralls, responses, nose }:

buildPythonPackage rec {
  pname = "openrouteservice";
  version = "2.2.2";

  src = fetchPypi {
    inherit pname version;
    sha256 = "1a7hr18vwgh9zl04njlhvrbkpxdq4vjd2pz3nbcfmhmq7mgvpin6";
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
