# My Automation Panel

Ein einfacher YAML-Automation-Creator als Custom Panel für Home Assistant (HACS-kompatibel).

## Installation
1. Dieses Repo in HACS als **Custom Repository** hinzufügen.
2. `configuration.yaml` ergänzen:
```yaml
panel_custom:
  - name: gardene-water-automation
    sidebar_title: "Water Automation"
    sidebar_icon: mdi:robot
    module_url: /hacsfiles/gardena_water_automation/gardene_water_automation.js
    url_path: gardene-water-automation-panel
