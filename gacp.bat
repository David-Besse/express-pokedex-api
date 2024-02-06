@echo off

REM Ajouter tous les fichiers modifiés ou nouvellement créés
git add .

REM Vérifier si un argument de message de commit est spécifié
IF '%1'=='' (
  echo Message de commit non spécifié. Veuillez fournir un message de commit.
  exit /b 1
)

REM Effectuer un commit avec le message spécifié
git commit -m '%1'

REM Pousser les modifications vers le dépôt distant
git push