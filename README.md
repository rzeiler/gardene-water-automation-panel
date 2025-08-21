# Gardene Water Automation Panel

Ein Custom Panel für Home Assistant, um Bewässerungs-Automationen komfortabel im UI zu erstellen.

## Installation über HACS
1. Repository zu HACS als **Custom Repository** hinzufügen  
   - URL: `https://github.com/rzeiler/gardene-water-automation-panel`  
   - Typ: **Frontend**  

2. Nach der Installation in `configuration.yaml` folgendes hinzufügen:
```yaml
panel_custom:
  - name: gardene-water-panel
    sidebar_title: "Water Automation"
    sidebar_icon: mdi:sprinkler
    module_url: /hacsfiles/gardene-water-automation-panel/my-automation-panel.js
    url_path: gardene-water-panel
