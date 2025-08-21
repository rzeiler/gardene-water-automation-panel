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
    conditionEntities: { type: Array },
    actionEntities: { type: Array },
    conditionEntity: { type: String },
    actionEntity: { type: String },
    status: { type: String }
  };

  constructor() {
    super();
    this.alias = "";
    this.time = "07:00";
    this.weekdays = [];
    this.conditionEntities = [];
    this.actionEntities = [];
    this.conditionEntity = "";
    this.actionEntity = "";
    this.status = "";
  }

  firstUpdated() {
    if (window.hass) {
      const all = Object.keys(window.hass.states);

      this.conditionEntities = all.filter(ent => ent.startsWith("input_boolean."));
      this.actionEntities = all.filter(ent => ent.startsWith("light.") || ent.startsWith("switch."));

      if (this.conditionEntities.length > 0) {
        this.conditionEntity = this.conditionEntities[0];
      }
      if (this.actionEntities.length > 0) {
        this.actionEntity = this.actionEntities[0];
      }
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
          <label>Condition Entity (nur input_boolean):</label>
          <select @change=${e => this.conditionEntity = e.target.value}>
            ${this.conditionEntities.map(ent => html`
              <option value=${ent} ?selected=${ent === this.conditionEntity}>
                ${window.hass.states[ent].attributes.friendly_name || ent}
              </option>
            `)}
          </select>
        </div>

        <div class="section">
          <label>Action Entity (nur light/switch):</label>
          <select @change=${e => this.actionEntity = e.target.value}>
            ${this.actionEntities.map(ent => html`
              <option value=${ent} ?selected=${ent === this.actionEntity}>
                ${window.hass.states[ent].attributes.friendly_name || ent}
              </option>
            `)}
          </select>
        </div>

        <button @click=${this.saveAutomation}>Automation speichern</button>
        <p><b>Status:</b> ${this.status}</p>
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

  async saveAutomation() {
    if (!window.hass) {
      this.status = "❌ Fehler: Kein Zugriff auf Home Assistant.";
      return;
    }

    try {
      await window.hass.callWS({
        type: "config/automation/create",
        alias: this.alias,
        description: "Erstellt mit My Automation Panel",
        mode: "single",
        trigger: [
          {
            platform: "time",
            at: this.time,
            weekday: this.weekdays
          }
        ],
        condition: [
          {
            condition: "state",
            entity_id: this.conditionEntity,
            state: "off"
          }
        ],
        action: [
          {
            service: "homeassistant.toggle",
            entity_id: this.actionEntity
          }
        ]
      });

      this.status = "✅ Automation erfolgreich gespeichert!";
    } catch (err) {
      console.error(err);
      this.status = "❌ Fehler beim Speichern der Automation.";
    }
  }
}

customElements.define("gardene-water-automation-panel", MyAutomationPanel);