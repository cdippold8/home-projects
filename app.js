(function () {
  'use strict';

  const STORAGE_KEY = 'home-projects-v1';
  const OPEN_GROUPS_KEY = 'home-projects-open-groups-v1';

  const taskById = new Map(TASKS.map((t) => [t.id, t]));

  const state = {
    done: loadDone(),
    openGroups: loadOpenGroups(),
    openMaterials: new Set(),
    view: 'schedule',
  };

  function loadDone() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveDone() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.done));
    } catch (e) {
      /* storage unavailable — state still works for this session */
    }
  }

  function loadOpenGroups() {
    try {
      const raw = localStorage.getItem(OPEN_GROUPS_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) return new Set(parsed);
    } catch (e) {
      /* fall through to default */
    }
    // Default: first week open, all category groups open.
    return new Set(['week-0', ...CATEGORIES.map((c) => 'cat-' + c.id)]);
  }

  function saveOpenGroups() {
    try {
      localStorage.setItem(OPEN_GROUPS_KEY, JSON.stringify([...state.openGroups]));
    } catch (e) {
      /* ignore */
    }
  }

  function isDone(taskId) {
    return !!state.done[taskId];
  }

  function toggleDone(taskId) {
    if (state.done[taskId]) {
      delete state.done[taskId];
    } else {
      state.done[taskId] = true;
    }
    saveDone();
    renderProgress();
    // Update every rendered instance of this task (schedule + all-tasks share ids).
    document.querySelectorAll('[data-task-id="' + cssEscape(taskId) + '"]').forEach((el) => {
      el.classList.toggle('done', isDone(taskId));
    });
  }

  function cssEscape(id) {
    return window.CSS && CSS.escape ? CSS.escape(id) : id.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        else node.setAttribute(k, v);
      }
    }
    (children || []).forEach((c) => c && node.appendChild(c));
    return node;
  }

  function checkIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke-width', '3');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M20 6 9 17l-5-5');
    svg.appendChild(path);
    return svg;
  }

  function renderMaterials(task) {
    const key = task._instanceKey;
    const wrap = el('div', { class: 'materials', 'data-materials-for': key });
    if (task.materials.length === 0) {
      wrap.appendChild(el('p', { class: 'empty', text: 'No materials needed — planning/research step.' }));
    } else {
      const ul = el('ul');
      task.materials.forEach((m) => ul.appendChild(el('li', { text: m })));
      wrap.appendChild(ul);
    }
    return wrap;
  }

  // Renders one task row. `instanceKey` disambiguates the schedule's reuse
  // of a single task across two calendar slots (e.g. the deck build).
  function renderTaskRow(task, opts) {
    opts = opts || {};
    const instanceKey = opts.instanceKey || task.id;
    const row = el('div', { class: 'task' + (isDone(task.id) ? ' done' : ''), 'data-task-id': task.id });

    const titleParts = [];
    titleParts.push(el('span', { text: task.project }));
    const stepText = opts.dayLabel || task.step;
    if (stepText) {
      titleParts.push(el('span', { class: 'task-step', text: ' — ' + stepText }));
    }

    const main = el('div', { class: 'task-main' }, [
      opts.dayTag ? el('span', { class: 'task-day', text: opts.dayTag }) : null,
      el('div', { class: 'task-title' }, titleParts),
      opts.flag ? el('span', { class: 'task-flag', text: '⚑ ' + opts.flag }) : null,
    ]);

    const checkBox = el('span', { class: 'check' }, [checkIcon()]);

    const clickRow = el('div', { class: 'task-row' }, [checkBox, main]);
    clickRow.addEventListener('click', () => toggleDone(task.id));

    const matBtn = el('button', { class: 'materials-toggle', type: 'button' });
    matBtn.textContent = 'Materials (' + task.materials.length + ')';
    const materialsEl = renderMaterials(Object.assign({}, task, { _instanceKey: instanceKey }));

    matBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = state.openMaterials.has(instanceKey);
      if (open) state.openMaterials.delete(instanceKey);
      else state.openMaterials.add(instanceKey);
      materialsEl.classList.toggle('open', !open);
    });

    if (state.openMaterials.has(instanceKey)) materialsEl.classList.add('open');

    const body = el('div', { style: 'padding: 0 14px 12px 48px;' }, [matBtn, materialsEl]);

    row.appendChild(clickRow);
    row.appendChild(body);
    return row;
  }

  function renderGroupHeader(groupId, title, metaText, countText) {
    const header = el('button', { class: 'group-header', type: 'button' }, [
      el('div', { class: 'titles' }, [
        el('h2', { text: title }),
        metaText ? el('div', { class: 'meta', text: metaText }) : null,
      ]),
      el('div', {}, [
        el('span', { class: 'count', text: countText }),
      ]),
    ]);
    const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chevron.setAttribute('viewBox', '0 0 24 24');
    chevron.setAttribute('width', '18');
    chevron.setAttribute('height', '18');
    chevron.setAttribute('fill', 'none');
    chevron.setAttribute('stroke', 'currentColor');
    chevron.setAttribute('stroke-width', '2.5');
    chevron.setAttribute('class', 'chevron');
    const cp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    cp.setAttribute('d', 'M9 6l6 6-6 6');
    chevron.appendChild(cp);
    header.lastChild.appendChild(chevron);
    header.addEventListener('click', () => {
      const open = state.openGroups.has(groupId);
      if (open) state.openGroups.delete(groupId);
      else state.openGroups.add(groupId);
      saveOpenGroups();
      header.parentElement.classList.toggle('open', !open);
    });
    return header;
  }

  function countDone(taskIds) {
    const total = taskIds.length;
    const done = taskIds.filter((id) => isDone(id)).length;
    return { done, total };
  }

  function renderSchedule() {
    const container = document.getElementById('view-schedule');
    container.innerHTML = '';

    SCHEDULE.forEach((week, idx) => {
      const groupId = 'week-' + idx;
      const taskIds = week.days.map((d) => d.taskId);
      const { done, total } = countDone(taskIds);
      const isOpen = state.openGroups.has(groupId);

      const group = el('div', { class: 'group' + (isOpen ? ' open' : '') });
      const titleText = week.label + (week.title ? ' — ' + week.title : '');
      group.appendChild(renderGroupHeader(groupId, titleText, week.dates, done + '/' + total));

      const body = el('div', { class: 'group-body' });
      week.days.forEach((d) => {
        const task = taskById.get(d.taskId);
        if (!task) return;
        const instanceKey = 'sched-' + idx + '-' + d.day;
        body.appendChild(
          renderTaskRow(task, {
            instanceKey,
            dayTag: d.day,
            dayLabel: d.label || task.step,
            flag: d.flag,
          })
        );
      });
      if (week.milestone) {
        body.appendChild(el('p', { class: 'milestone', text: '🚧 ' + week.milestone }));
      }
      group.appendChild(body);
      container.appendChild(group);
    });
  }

  function renderAllTasks() {
    const container = document.getElementById('view-tasks');
    container.innerHTML = '';

    CATEGORIES.forEach((cat) => {
      const tasks = TASKS.filter((t) => t.category === cat.id);
      if (tasks.length === 0) return;
      const groupId = 'cat-' + cat.id;
      const { done, total } = countDone(tasks.map((t) => t.id));
      const isOpen = state.openGroups.has(groupId);

      const group = el('div', { class: 'group category-' + cat.id + (isOpen ? ' open' : '') });
      group.appendChild(renderGroupHeader(groupId, cat.label, cat.note, done + '/' + total));

      const body = el('div', { class: 'group-body' });

      // Group by project within the category, in source order.
      const projects = [];
      const seen = new Map();
      tasks.forEach((t) => {
        if (!seen.has(t.project)) {
          seen.set(t.project, []);
          projects.push(t.project);
        }
        seen.get(t.project).push(t);
      });

      projects.forEach((projectName) => {
        seen.get(projectName).forEach((task) => {
          body.appendChild(renderTaskRow(task, { instanceKey: 'ref-' + task.id }));
        });
      });

      group.appendChild(body);
      container.appendChild(group);
    });
  }

  function renderProgress() {
    const total = TASKS.length;
    const done = TASKS.filter((t) => isDone(t.id)).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-text').textContent = done + ' of ' + total + ' done';
    document.getElementById('progress-pct').textContent = pct + '%';
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function setView(view) {
    state.view = view;
    document.getElementById('view-schedule').classList.toggle('active', view === 'schedule');
    document.getElementById('view-tasks').classList.toggle('active', view === 'tasks');
    document.getElementById('tab-schedule').classList.toggle('active', view === 'schedule');
    document.getElementById('tab-tasks').classList.toggle('active', view === 'tasks');
  }

  function init() {
    renderSchedule();
    renderAllTasks();
    renderProgress();

    document.getElementById('tab-schedule').addEventListener('click', () => setView('schedule'));
    document.getElementById('tab-tasks').addEventListener('click', () => setView('tasks'));

    document.getElementById('reset-btn').addEventListener('click', () => {
      if (!confirm('Clear all checkmarks? This cannot be undone.')) return;
      state.done = {};
      saveDone();
      renderSchedule();
      renderAllTasks();
      renderProgress();
      showToast('All checkmarks cleared');
    });

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
