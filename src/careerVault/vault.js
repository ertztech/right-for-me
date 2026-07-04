let careerVault = RightForMeCareerVaultStorage.loadVault();
let careerVaultControllerApi = null;

function getVault() {
  return careerVault;
}

function saveVault() {
  careerVaultControllerApi?.syncFromForm();
  writeVault();
}

function writeVault() {
  RightForMeCareerVaultStorage.saveVault(careerVault);
}

function initializeCareerVault() {
  careerVaultControllerApi = RightForMeCareerVaultController.initializeCareerVaultController({
    getVault,
    saveVault: writeVault,
  });
}

window.RightForMeCareerVault = {
  initializeCareerVault,
  getVault,
  saveVault,
};
