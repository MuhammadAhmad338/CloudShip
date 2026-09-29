resource "azurerm_resource_group" "main" {
  name     = "rg-azure-devops-platform"
  location = "West US 3"

  tags = {
    project     = "azure-devops-platform"
    environment = "development"
    managed_by  = "terraform"
  }
}