let careerVault = RightForMeCareerVaultStorage.loadVault();

function getVault() {
  return careerVault;
}

function saveVault() {
  RightForMeCareerVaultStorage.saveVault(careerVault);
}

function initializeCareerVault() {
  RightForMeCareerVaultController.initializeCareerVaultController({
    getVault,
    saveVault,
  });
}

window.RightForMeCareerVault = {
  initializeCareerVault,
  getVault,
  saveVault,
};