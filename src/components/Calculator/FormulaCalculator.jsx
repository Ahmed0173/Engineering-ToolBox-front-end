
import { useEffect, useMemo, useState } from 'react';
import formulaService from '../../services/formulaService';
import './FormulaCalculator.scss';

const CATEGORIES = [
  { value: 'ALL',             label: 'All Categories' },
  { value: 'ELECTRICAL',      label: 'Electrical' },
  { value: 'MECHANICAL',      label: 'Mechanical' },
  { value: 'CIVIL',           label: 'Civil' },
  { value: 'CHEMICAL',        label: 'Chemical' },
  { value: 'PHYSICS',         label: 'Physics' },
  { value: 'MATHEMATICS',     label: 'Mathematics' },
  { value: 'THERMODYNAMICS',  label: 'Thermodynamics' },
  { value: 'FLUID_MECHANICS', label: 'Fluid Mechanics' },
  { value: 'MATERIAL_SCIENCE',label: 'Material Science' },
];

export default function FormulaCalculator({ calculatorId = 'formula-calc', onCalculation }) {
  // filters & list
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [formulas, setFormulas] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState('');

  // selection & meta
  const [selectedId, setSelectedId] = useState('');
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [options, setOptions] = useState([]);   // [{ outputVariable, requiredInputs }]
  const [loadingOpts, setLoadingOpts] = useState(false);
  const [optsError, setOptsError] = useState('');

  // calculation
  const [outputVar, setOutputVar] = useState('');  // key, e.g. 'V'
  const [inputs, setInputs] = useState({});        // { I: 2, R: 10 }
  const [result, setResult] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState('');

  // ─────────────── fetch formulas list ───────────────
  useEffect(() => {
    (async () => {
      try {
        setLoadingList(true);
        setListError('');
        const filters = {};
        if (category !== 'ALL') filters.category = category;
        if (search.trim())      filters.search   = search.trim();
  const list = await formulaService.getFormulas(filters);
  setFormulas(Array.isArray(list) ? list : (list?.items || list?.formulas || []));
      } catch (err) {
        setListError('Failed to load formulas');
        console.error(err);
      } finally {
        setLoadingList(false);
      }
    })();
  }, [category, search]);

  // ─────────────── fetch selected formula + options ───────────────
  useEffect(() => {
    if (!selectedId) {
      setSelectedFormula(null);
      setOptions([]);
      setOutputVar('');
      setInputs({});
      setResult(null);
      setOptsError('');
      return;
    }
    (async () => {
      try {
        setLoadingOpts(true);
        setOptsError('');
        const f = await formulaService.getFormulaById(selectedId);
        setSelectedFormula(f || null);

        const o = await formulaService.getFormulaCalculationOptions(selectedId);
        const opts = Array.isArray(o) ? o : [];
        setOptions(opts);

        if (opts.length) {
          setOutputVar(opts[0].outputVariable);
          const init = {};
          (opts[0].requiredInputs || []).forEach(k => (init[k] = ''));
          setInputs(init);
        } else {
          setOutputVar('');
          setInputs({});
        }
        setResult(null);
      } catch (err) {
        setOptsError('Failed to load formula details');
        console.error(err);
      } finally {
        setLoadingOpts(false);
      }
    })();
  }, [selectedId]);

  // when output changes, reset inputs for that option
  useEffect(() => {
    if (!outputVar || !options.length) return;
    const opt = options.find(o => o.outputVariable === outputVar);
    if (!opt) return;
    const next = {};
    (opt.requiredInputs || []).forEach(k => (next[k] = inputs[k] ?? ''));
    setInputs(next);
    setResult(null);
    setCalcError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputVar]);

  // helpers
  const variableMeta = (key) => selectedFormula?.variables?.find(v => v.key === key) || null;
  const nameOf       = (key) => variableMeta(key)?.name || key;
  const unitOf       = (key) => variableMeta(key)?.unit || '';
  const constraints  = (key) => variableMeta(key)?.constraints || {};
  const filteredFormulas = useMemo(() => formulas, [formulas]);

  const onInput = (k, v) => setInputs(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const opt = options.find(o => o.outputVariable === outputVar);
    if (!opt) return 'Pick what to solve for';

    for (const k of opt.requiredInputs || []) {
      const raw = inputs[k];
      if (raw === '' || raw === null || raw === undefined) {
        return `Enter ${nameOf(k)} (${k})`;
      }
      const num = Number(raw);
      if (Number.isNaN(num)) return `${nameOf(k)} must be a number`;
      const c = constraints(k);
      if (c.mustBePositive && num <= 0) return `${nameOf(k)} must be > 0`;
      if (typeof c.min === 'number' && num < c.min) return `${nameOf(k)} ≥ ${c.min}`;
    }
    return null;
  };

  const onCalculate = async () => {
    setCalcError('');
    setResult(null);

    const err = validate();
    if (err) return setCalcError(err);

    const opt = options.find(o => o.outputVariable === outputVar);
    if (!opt) return setCalcError('Invalid calculation option');

    const payload = {
      formulaId: selectedId,
      outputVariable: outputVar,
      inputs: {},
    };
    opt.requiredInputs.forEach(k => { payload.inputs[k] = Number(inputs[k]); });

    try {
      setCalcLoading(true);
      const res = await formulaService.performFormulaCalculation(payload);
      const value = (res && typeof res.result !== 'undefined')
        ? res.result
        : (typeof res === 'number' ? res : null);
      if (value === null) throw new Error(res?.message || 'Calculation failed');

      setResult(value);
      onCalculation?.({
        calculatorId,
        formulaId: selectedId,
        formulaName: selectedFormula?.name,
        outputVariable: outputVar,
        inputs: payload.inputs,
        result: value,
        at: Date.now(),
      });
    } catch (e) {
      setCalcError(e?.message || 'Calculation failed');
    } finally {
      setCalcLoading(false);
    }
  };

  return (
    <div className="formula-calc">
      {/* top controls */}
      <div className="fc-controls">
        <div className="fc-field">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div className="fc-field">
          <label>Search</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ohm, Pressure, Force…"
          />
        </div>

        <div className="fc-field grow">
          <label>Formula</label>
          {loadingList ? (
            <div className="muted">Loading…</div>
          ) : listError ? (
            <div className="error">{listError}</div>
          ) : (
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              <option value="">Select a formula…</option>
              {filteredFormulas.map(f => (
                <option key={f._id} value={f._id}>
                  {f.name}{f.category ? ` — ${f.category}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* main body */}
      {selectedFormula && (
        <div className="fc-body">
          {/* info */}
          <aside className="fc-info">
            <div className="card">
              <div className="title">{selectedFormula.name}</div>
              {selectedFormula.description && <div className="muted">{selectedFormula.description}</div>}
              {selectedFormula.formula && <div className="math"><code>{selectedFormula.formula}</code></div>}
              {!!selectedFormula.tags?.length && (
                <div className="tags">
                  {selectedFormula.tags.map((t, i) => <span key={i} className="tag">#{t}</span>)}
                </div>
              )}
            </div>
          </aside>

          {/* work panel */}
          <section className="fc-work">
            <div className="fc-field">
              <label>Solve for</label>
              {loadingOpts ? (
                <div className="muted">Loading options…</div>
              ) : optsError ? (
                <div className="error">{optsError}</div>
              ) : (
                <select value={outputVar} onChange={(e) => setOutputVar(e.target.value)}>
                  {!options.length && <option value="">No options</option>}
                  {options.map(o => {
                    const meta = selectedFormula.variables?.find(v => v.key === o.outputVariable);
                    const label = meta ? `${meta.name} (${meta.key})` : o.outputVariable;
                    return <option key={o.outputVariable} value={o.outputVariable}>{label}</option>;
                  })}
                </select>
              )}
            </div>

            {outputVar && (
              <div className="inputs-grid">
                {options.find(o => o.outputVariable === outputVar)?.requiredInputs?.map((k) => {
                  const meta = selectedFormula.variables?.find(v => v.key === k);
                  return (
                    <div key={k} className="fc-field">
                      <label>
                        {meta?.name || k}
                        {meta?.unit ? <span className="unit"> ({meta.unit})</span> : null}
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="any"
                        value={inputs[k] ?? ''}
                        onChange={(e) => onInput(k, e.target.value)}
                        placeholder={meta?.description || k}
                      />
                      {meta?.constraints?.min != null && (
                        <small className="hint">min: {meta.constraints.min}</small>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="actions">
              <button className="calc-btn" disabled={!outputVar || calcLoading} onClick={onCalculate}>
                {calcLoading ? 'Calculating…' : 'Calculate'}
              </button>
              {calcError && <div className="error">{calcError}</div>}
            </div>

            {result !== null && result !== undefined && (
              <div className="result-card">
                <div className="label">Result</div>
                <div className="value">
                  {String(result)}
                  {unitOf(outputVar) ? <span className="unit"> {unitOf(outputVar)}</span> : null}
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
