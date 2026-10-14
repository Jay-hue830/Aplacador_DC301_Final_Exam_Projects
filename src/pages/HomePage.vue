<template>
  <div class="overview-page page-wrap">
    <section class="overview-hero">
      <div class="overview-copy">
        <p class="eyebrow eyebrow-soft"><span class="live-dot"></span> STREET OPERATIONS BOARD</p>
        <h1>See road issues. <em>Fix them faster.</em></h1>
        <p class="overview-lead">
          A clearer way to log road damage, sort urgent cases, and keep repairs moving without the usual chaos.
        </p>

        <div class="overview-actions">
          <RouterLink class="button button-dark" to="/hazards">Open dashboard</RouterLink>
          <RouterLink class="button button-light" to="/requirements">How it works</RouterLink>
        </div>

        <ul class="mini-stats" aria-label="Summary statistics">
          <li>
            <strong>128</strong>
            <span>reports logged</span>
          </li>
          <li>
            <strong>34</strong>
            <span>resolved this week</span>
          </li>
          <li>
            <strong>9</strong>
            <span>urgent cases</span>
          </li>
        </ul>
      </div>

      <div class="overview-panel" aria-label="Road safety overview panel">
        <div class="panel-topbar">
          <div>
            <p>Road network status</p>
            <h2>Live overview</h2>
          </div>
          <span class="status-pill">Updated 4m ago</span>
        </div>

        <div class="panel-grid">
          <div class="metric-card accent">
            <span class="metric-label">Open hazards</span>
            <strong>24</strong>
            <small>+6 since Monday</small>
          </div>
          <div class="metric-card">
            <span class="metric-label">Priority</span>
            <strong>High</strong>
            <small>8 critical areas</small>
          </div>
          <div class="metric-card wide">
            <span class="metric-label">Coverage</span>
            <div class="progress-wrap">
              <div class="progress-bar"><span></span></div>
              <strong>78%</strong>
            </div>
            <small>District coverage this month</small>
          </div>
        </div>

        <div class="alert-list">
          <div class="alert-item">
            <span class="alert-dot orange"></span>
            <div>
              <strong>Pothole cluster</strong>
              <small>Rizal Street · 3 reports</small>
            </div>
            <em>High</em>
          </div>
          <div class="alert-item">
            <span class="alert-dot teal"></span>
            <div>
              <strong>Broken drainage</strong>
              <small>Mapagma Ave · 2 reports</small>
            </div>
            <em>Medium</em>
          </div>
          <div class="alert-item">
            <span class="alert-dot red"></span>
            <div>
              <strong>Traffic sign missing</strong>
              <small>San Pedro Rd · 1 report</small>
            </div>
            <em>Urgent</em>
          </div>
        </div>
      </div>
    </section>

    <section class="insight-grid" aria-label="Overview insights">
      <article class="insight-card">
        <span class="card-kicker">Monitor</span>
        <h3>See issues as they happen.</h3>
        <p>Capture new road concerns in real time and keep crews focused on the highest-risk locations.</p>
      </article>

      <article class="insight-card">
        <span class="card-kicker">Prioritize</span>
        <h3>Sort by urgency.</h3>
        <p>Distinguish routine repairs from dangerous conditions before they become bigger problems.</p>
      </article>

      <article class="insight-card">
        <span class="card-kicker">Respond</span>
        <h3>Keep teams aligned.</h3>
        <p>Track the latest status across every report and make each handoff easy to understand.</p>
      </article>
    </section>

  </div>
</template>
