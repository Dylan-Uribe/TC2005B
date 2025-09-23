// Tasks Frontend (Vanilla JS) — talks to Node/Express API
// All comments in English (per your rule).
(() => {
  const API_BASE = 'http://localhost:3001'; // change if your API runs elsewhere
  const STATUSES = ['sin_iniciar', 'en_curso', 'terminada'];

  // ---------- HTTP helpers ----------
  async function http(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      let msg = `${res.status} ${res.statusText}`;
      try {
        const body = await res.json();
        msg = body?.error || msg;
      } catch (_) {}
      throw new Error(msg);
    }
    const txt = await res.text();
    return txt ? JSON.parse(txt) : null;
  }
  const get = (p) => http(p);
  const post = (p, body) => http(p, { method: 'POST', body: JSON.stringify(body) });
  const patch = (p, body) => http(p, { method: 'PATCH', body: JSON.stringify(body) });
  const del = (p) => http(p, { method: 'DELETE' });

  // ---------- DOM helpers ----------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (v !== null && v !== undefined) node.setAttribute(k, v);
    });
    for (const child of children) {
      if (child == null) continue;
      node.appendChild(child.nodeType ? child : document.createTextNode(String(child)));
    }
    return node;
  }

  // ---------- State ----------
  let USERS = [];
  let TASKS = [];
  let PAGE = 1;
  let PAGE_SIZE = 10;
  let TOTAL = 0;

  // ---------- UI Builders ----------
  function buildLayout(root) {
    const container = el('div', { class: 'container' },
      el('h1', {}, 'Tablita de Tareas'),
      el('div', { class: 'grid' },
        el('section', { class: 'panel' },
          el('h2', {}, 'Nueva tarea'),
          buildCreateForm()
        ),
        el('section', { class: 'panel' },
          el('h2', {}, 'Filtros'),
          buildFilters()
        )
      ),
      el('section', { class: 'panel' },
        el('h2', {}, 'Usuarios'),
        buildUserForm(),
        el('div', { id: 'users-root' })
      ),
      el('section', { class: 'panel' },
        el('h2', {}, 'Listado de tareas'),
        el('div', { id: 'tasks-root' })
      )
    );
    root.appendChild(styleTag());
    root.appendChild(container);
  }

  function styleTag() {
    return el('style', {}, `
      :root { --bg:#0b0f1a; --panel:#101425; --txt:#e8ecff; --muted:#9aa3c7; --ok:#19c37d; --warn:#f5a524; --err:#ef4444; }
      *{box-sizing:border-box} body{margin:0;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:var(--bg);color:var(--txt)}
      .container{max-width:1100px;margin:32px auto;padding:0 16px}
      h1{font-size:28px;margin:0 0 16px}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
      .panel{background:var(--panel);border-radius:14px;padding:16px;box-shadow:0 8px 24px rgba(0,0,0,.25)}
      .row{display:flex;gap:8px;align-items:center;margin-bottom:8px}
      input, select, textarea, button{background:#0d1222;border:1px solid #1a2140;color:var(--txt);padding:8px 10px;border-radius:10px}
      textarea{min-height:72px;resize:vertical}
      button{cursor:pointer}
      button.primary{background:#1a2140;border-color:#293062}
      button.success{background:#163225;border-color:#225d45}
      button.warn{background:#352c10;border-color:#5f4e1a}
      button:disabled{opacity:.6;cursor:not-allowed}
      table{width:100%;border-collapse:separate;border-spacing:0 8px}
      thead th{font-weight:600;color:var(--muted);text-align:left;padding:0 8px 8px}
      tbody tr{background:#0d1222}
      tbody td{padding:12px 8px;vertical-align:top}
      .badge{display:inline-block;padding:2px 8px;border-radius:999px;font-size:12px;border:1px solid #2a325f;color:#cbd5ff}
      .status-sin_iniciar{border-color:#4b5563;color:#d1d5db}
      .status-en_curso{border-color:#f59e0b;color:#fbbf24}
      .status-terminada{border-color:#10b981;color:#34d399}
      .actions{display:flex;gap:8px;flex-wrap:wrap}
      .muted{color:var(--muted)}
      .sr-only{position:absolute;width:1px;height:1px;margin:-1px;clip:rect(0,0,0,0);overflow:hidden}
      .chips{display:flex;gap:8px;flex-wrap:wrap}
      .chip{background:#0d1222;border:1px solid #1a2140;border-radius:999px;padding:6px 10px}
      .pagination{display:flex;gap:8px;align-items:center;justify-content:flex-end;margin-top:10px}
    `);
  }

  // ---------- Users UI ----------
  function buildUserForm() {
    const name = el('input', { type: 'text', placeholder: 'Nombre de usuario *', required: true });
    const btn = el('button', { class: 'primary', type: 'button', onclick: onCreateUser }, 'Crear usuario');

    async function onCreateUser() {
      console.log('onCreateUser called!')
      btn.disabled = true;
      try {
        const payload = { name: name.value.trim() };
        if (!payload.name) { alert('Name is required'); return; }
        await post('/users', payload);
        name.value = '';
        await reloadUsers();
        await reloadTasks(); // refresh selects and list
      } catch (e) {
        console.error(e);
        alert(`Create user failed: ${e.message}`);
      } finally {
        btn.disabled = false;
      }
    }

    return el('form', { class: 'form', onSubmit: (e) => e.preventDefault() },
      el('div', { class: 'row' }, name, btn),
      el('p', { class: 'muted' }, 'Los usuarios aparecen en los selects de asignación.')
    );
  }

  function renderUsers(list) {
    const host = $('#users-root');
    host.innerHTML = '';
    if (!list.length) {
      host.appendChild(el('p', { class: 'muted' }, 'Sin usuarios aún.'));
      return;
    }
    const wrap = el('div', { class: 'chips' });
    list.forEach(u => wrap.appendChild(el('span', { class: 'chip' }, `${u.name} (id:${u.id})`)));
    host.appendChild(wrap);
  }

  // ---------- Tasks UI ----------
  function buildCreateForm() {
    const title = el('input', { type: 'text', placeholder: 'Título *', required: true });
    const description = el('textarea', { placeholder: 'Descripción' });
    const assignee = el('select', {});
    const status = el('select', {});
    for (const s of STATUSES) status.appendChild(el('option', { value: s }, s));
    const btn = el('button', { class: 'primary', type: 'button', onclick: onCreate }, 'Crear tarea');

    function refreshAssignees() {
      assignee.innerHTML = '';
      assignee.appendChild(el('option', { value: '' }, '— Sin asignar —'));
      USERS.forEach(u => assignee.appendChild(el('option', { value: String(u.id) }, u.name)));
    }

    async function onCreate() {
      btn.disabled = true;
      try {
        const payload = {
          title: title.value.trim(),
          description: description.value.trim(),
          status: status.value,
          assignee_id: assignee.value ? Number(assignee.value) : null,
        };
        if (!payload.title) { alert('Title is required'); return; }
        await post('/tasks', payload);
        title.value = '';
        description.value = '';
        assignee.value = '';
        status.value = STATUSES[0];
        await reloadTasks();
      } catch (e) {
        console.error(e);
        alert(`Create failed: ${e.message}`);
      } finally {
        btn.disabled = false;
      }
    }

    buildCreateForm.refreshAssignees = refreshAssignees;

    return el('form', { class: 'form', onSubmit: (e) => e.preventDefault() },
      el('div', { class: 'row' }, title),
      el('div', { class: 'row' }, description),
      el('div', { class: 'row' }, assignee, status),
      el('div', { class: 'row' }, btn)
    );
  }

  function buildFilters() {
    const fQ = el('input', { id: 'filter-q', type: 'search', placeholder: 'Buscar texto (título o descripción)' });
    const fStatus = el('select', { id: 'filter-status' },
      el('option', { value: '' }, 'Todos los estados'),
      ...STATUSES.map(s => el('option', { value: s }, s))
    );
    const fAssignee = el('select', { id: 'filter-assignee' });
    const fPageSize = el('select', { id: 'page-size' },
      el('option', { value: '5' }, '5'),
      el('option', { value: '10', selected: 'selected' }, '10'),
      el('option', { value: '20' }, '20'),
      el('option', { value: '50' }, '50')
    );

    const apply = async () => {
      PAGE = 1; // reset to first page on filter/search change
      PAGE_SIZE = parseInt(fPageSize.value, 10);
      await reloadTasks();
    };

    const fBtn = el('button', { type: 'button', onclick: apply }, 'Aplicar');

    fQ.addEventListener('keydown', (e) => { if (e.key === 'Enter') apply(); });

    function refreshAssignees() {
      fAssignee.innerHTML = '';
      fAssignee.appendChild(el('option', { value: '' }, 'Todas las personas'));
      USERS.forEach(u => fAssignee.appendChild(el('option', { value: String(u.id) }, u.name)));
    }
    buildFilters.refreshAssignees = refreshAssignees;

    return el('div', {},
      el('div', { class: 'row' }, fQ),
      el('div', { class: 'row' }, fStatus, fAssignee, fPageSize, fBtn),
      el('p', { class: 'muted' }, 'Tip: usa búsqueda + filtros; paginación abajo de la tabla.')
    );
  }

  function renderTasks(list) {
    const host = $('#tasks-root');
    host.innerHTML = '';

    const table = el('table', {},
      el('thead', {}, el('tr', {},
        el('th', {}, 'Título'),
        el('th', {}, 'Asignado'),
        el('th', {}, 'Estado'),
        el('th', {}, 'Acciones')
      )),
      el('tbody', {})
    );

    list.forEach(t => {
      const assigneeSel = el('select', {
        onChange: async (e) => {
          try {
            const value = e.target.value;
            await patch(`/tasks/${t.id}`, { assignee_id: value ? Number(value) : null });
            await reloadTasks();
          } catch (err) {
            console.error(err);
            alert(`Update failed: ${err.message}`);
          }
        }
      });
      assigneeSel.appendChild(el('option', { value: '' }, '— Sin asignar —'));
      USERS.forEach(u => assigneeSel.appendChild(el('option', { value: String(u.id) }, u.name)));
      assigneeSel.value = t.assignee_id ? String(t.assignee_id) : '';

      const statusSel = el('select', {
        onChange: async (e) => {
          try {
            const value = e.target.value;
            if (!STATUSES.includes(value)) return;
            await patch(`/tasks/${t.id}`, { status: value });
            await reloadTasks();
          } catch (err) {
            console.error(err);
            alert(`Update failed: ${err.message}`);
          }
        }
      });
      STATUSES.forEach(s => statusSel.appendChild(el('option', { value: s }, s)));
      statusSel.value = t.status;

      const nextBtn = el('button', {
        class: 'success',
        type: 'button',
        onclick: async () => {
          try {
            const next = nextStatus(t.status);
            await patch(`/tasks/${t.id}`, { status: next });
            await reloadTasks();
          } catch (err) {
            console.error(err);
            alert(`Update failed: ${err.message}`);
          }
        }
      }, 'Siguiente estado');

      const delBtn = el('button', {
        class: 'warn',
        type: 'button',
        onclick: async () => {
          try {
            if (!confirm('¿Borrar esta tarea?')) return;
            await del(`/tasks/${t.id}`);
            await reloadTasks();
          } catch (err) {
            console.error(err);
            alert(`Delete failed: ${err.message}`);
          }
        }
      }, 'Eliminar');

      const row = el('tr', {},
        el('td', {}, el('div', {}, el('div', {}, t.title), el('div', { class: 'muted' }, t.description || ''))),
        el('td', {}, assigneeSel),
        el('td', {}, el('span', { class: `badge status-${t.status}` }, t.status)),
        el('td', { class: 'actions' }, statusSel, nextBtn, delBtn)
      );

      table.querySelector('tbody').appendChild(row);
    });

    host.appendChild(table);
    host.appendChild(renderPagination());
  }

  function renderPagination() {
    const wrap = el('div', { class: 'pagination' });

    const totalPages = Math.max(1, Math.ceil(TOTAL / PAGE_SIZE));
    const start = TOTAL === 0 ? 0 : (PAGE - 1) * PAGE_SIZE + 1;
    const end = Math.min(PAGE * PAGE_SIZE, TOTAL);

    const info = el('span', {}, `Mostrando ${start}–${end} de ${TOTAL} (página ${PAGE} de ${totalPages})`);
    const prev = el('button', { type: 'button', onclick: onPrev, disabled: PAGE <= 1 }, '« Anterior');
    const next = el('button', { type: 'button', onclick: onNext, disabled: PAGE >= totalPages }, 'Siguiente »');

    async function onPrev() {
      if (PAGE <= 1) return;
      PAGE -= 1;
      await reloadTasks();
    }
    async function onNext() {
      if (PAGE >= totalPages) return;
      PAGE += 1;
      await reloadTasks();
    }

    wrap.appendChild(info);
    wrap.appendChild(prev);
    wrap.appendChild(next);
    return wrap;
  }

  function nextStatus(s) {
    const i = STATUSES.indexOf(s);
    return STATUSES[(i + 1) % STATUSES.length];
  }

  // ---------- Data loading ----------
  async function reloadUsers() {
    USERS = await get('/users');
    renderUsers(USERS);
    if (typeof buildCreateForm.refreshAssignees === 'function') buildCreateForm.refreshAssignees();
    if (typeof buildFilters.refreshAssignees === 'function') buildFilters.refreshAssignees();
  }

  async function reloadTasks() {
    const status = $('#filter-status')?.value || '';
    const assignee = $('#filter-assignee')?.value || '';
    const q = $('#filter-q')?.value?.trim() || '';

    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (status) params.set('status', status);
    if (assignee) params.set('assignee_id', assignee);
    params.set('page', String(PAGE));
    params.set('pageSize', String(PAGE_SIZE));

    const data = await get(`/tasks?${params.toString()}`);
    const items = data.items || [];
    TOTAL = data.total ?? items.length;
    PAGE = data.page ?? PAGE;
    PAGE_SIZE = data.pageSize ?? PAGE_SIZE;

    if (items.length === 0 && TOTAL > 0 && PAGE > 1) {
      PAGE -= 1;
      return reloadTasks();
    }

    TASKS = items;
    renderTasks(TASKS);
  }

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', async () => {
    const root = document.getElementById('app') || document.body;
    buildLayout(root);
    try {
      await get('/health');
      await reloadUsers();
      await reloadTasks();
    } catch (e) {
      console.error(e);
      alert(`API not reachable: ${e.message}. Check API_BASE or CORS.`);
    }
  });
})();