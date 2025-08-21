import { LitElement, html, css } from "lit";

class MyAutomationPanel extends LitElement {
  static styles = css`
    .container { padding: 20px; font-family: sans-serif; }
    .section { margin-bottom: 20px; }
    label { display: block; margin: 5px 0; }
    input, select { padding: 5px; margin-top: 5px; }
    button {
      margin-top: 10px;
      padding: 8px 14px;
      background: #03a9f4;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    pre {
      background: #222;
      color: #0f0;
      padding: 10px;
      border-radius: 5px;
      margin-top: 20px;
      white-space: pre-wrap;
    }
  `;

  static properties = {
    alias: { type: String },
    time: { type: String },
    weekdays: { type: Array },
    entities: { type: Array },
    conditionEntity: { type: String },
    actionEntity: { type: String },
  };

  constructor() {
    super();
    this.alias = "";
    this.time = "07:00";
    this.weekdays = [];
    this.entities = [];
    this.conditionEntity = "";
    this.actionEntity = "";
  }

  firstUpdated() {
    // hole Entities direkt aus Home Assistant
    if (window.hass) {
      this.entities = Object.keys(window.hass.states);
      // Defaults setzen
      if (this.entities.length > 0) {
        this.conditionEntity = this.entities[0];
        this.actionEntity = this.entities[0];
      }
    } else {
      console.warn("⚠️ Kein Zugriff auf window.hass – läuft Panel in HA?");
    }
  }

  render() {
    return html`
      <div class="container">
        <h2>Automation Creator</h2>

        <div class="section">
          <label>Alias:</label>
          <input type="text" .value=${this.alias} 
                 @input=${e => this.alias = e.target.value}>
        </div>

        <div class="section">
          <label>Trigger Zeit:</label>
          <input type="time" .value=${this.time} 
                 @input=${e => this.time = e.target.value}>
        </div>

        <div class="section">
          <label>Wochentage:</label>
          ${["mon","tue","wed","thu","fri","sat","sun"].map(day => html`
            <label>
              <input type="checkbox" value=${day} 
                @change=${e => this.toggleWeekday(e)}> ${day}
            </label>
          `)}
        </div>

        <div class="section">
          <label>Condition Entity:</label>
          <select @change=${e => this.conditionEntity = e.target.value}>
            ${this.entities.map(ent => html`
              <option value=${ent} ?selected=${ent === this.conditionEntity}>
                ${ent}
              </option>
            `)}
          </select>
        </div>

        <div class="section">
          <label>Action Entity:</label>
          <select @change=${e => this.actionEntity = e.target.value}>
            ${this.entities.map(ent => html`
              <option value=${ent} ?selected=${ent === this.actionEntity}>
                ${ent}
              </option>
            `)}
          </select>
        </div>

        <button @click=${this.generateYAML}>YAML erstellen</button>

        <pre id="output"></pre>
      </div>
    `;
  }

  toggleWeekday(e) {
    if (e.target.checked) {
      this.weekdays = [...this.weekdays, e.target.value];
    } else {
      this.weekdays = this.weekdays.filter(d => d !== e.target.value);
    }
  }

  generateYAML() {
    const yaml = `
alias: ${this.alias}
description: erstellt mit My Automation Panel
trigger:
  - platform: time
    at: "${this.time}"
    weekday: [${this.weekdays.join(", ")}]
condition:
  - condition: state
    entity_id: ${this.conditionEntity}
    state: "off"
action:
  - service: homeassistant.toggle
    entity_id: ${this.actionEntity}
mode: single
    `;

    this.shadowRoot.getElementById("output").innerText = yaml.trim();
  }
}

customElements.define("gardene-water-automation-panel", MyAutomationPanel);