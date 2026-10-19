import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { SubmitEvent } from 'react';
const types = [
  ['kuchnia', 'Kuchnia'],
  ['garderoba', 'Szafa lub garderoba'],
  ['salon', 'Zabudowa salonu'],
  ['nie-wiem', 'Jeszcze nie wiem'],
] as const;
const stages = ['Zbieram inspiracje', 'Mam wymiary', 'Mam gotowy projekt'];
type Brief = {
  type: string;
  stage: string;
  description: string;
  deadline: string;
  name: string;
  email: string;
};
const empty: Brief = {
  type: '',
  stage: '',
  description: '',
  deadline: '',
  name: '',
  email: '',
};
const typeLabel = (value: string) =>
  types.find(([key]) => key === value)?.[1] ?? 'Jeszcze nie wiem';
export default function BriefForm() {
  const [data, setData] = useState<Brief>(empty);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const region = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const invalidField = useRef<string | null>(null);
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('typ');
    if (types.some(([key]) => key === value))
      setData((prev) => ({ ...prev, type: value! }));
    setReady(true);
  }, []);
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    region.current?.focus();
  }, [step]);
  useLayoutEffect(() => {
    if (!invalidField.current) return;
    document.getElementById(invalidField.current)?.focus();
    invalidField.current = null;
  }, [errors]);
  function change(key: keyof Brief, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }
  function next(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (step === 0 && !data.type)
      nextErrors.type =
        'Wybierz rodzaj projektu. Możesz wybrać „Jeszcze nie wiem”.';
    if (step === 1 && !data.stage)
      nextErrors.stage = 'Wybierz etap, na którym jesteś.';
    if (step === 2) {
      if (!data.name.trim()) nextErrors.name = 'Wpisz przykładowe imię.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
        nextErrors.email =
          'Wpisz poprawny przykładowy e-mail, np. anna@example.com.';
    }
    const keys = Object.keys(nextErrors);
    invalidField.current = keys[0] ?? null;
    setErrors(nextErrors);
    if (keys.length) return;
    setStep((value) => value + 1);
  }
  const summary = (contact = false) => (
    <dl className="form-summary">
      <div>
        <dt>Rodzaj projektu</dt>
        <dd>{typeLabel(data.type)}</dd>
      </div>
      <div>
        <dt>Etap</dt>
        <dd>{data.stage}</dd>
      </div>
      <div>
        <dt>Twoja potrzeba</dt>
        <dd>{data.description.trim() || 'Nie dodano opisu'}</dd>
      </div>
      <div>
        <dt>Preferowany termin</dt>
        <dd>{data.deadline.trim() || 'Do ustalenia'}</dd>
      </div>
      {contact && (
        <>
          <div>
            <dt>Imię</dt>
            <dd>{data.name.trim()}</dd>
          </div>
          <div>
            <dt>Przykładowy e-mail</dt>
            <dd>{data.email.trim()}</dd>
          </div>
        </>
      )}
    </dl>
  );
  return (
    <div
      className="brief-form"
      ref={region}
      tabIndex={-1}
      role="region"
      aria-label="Formularz przygotowania briefu"
    >
      <div className="form-notice">
        <strong>Formularz demonstracyjny.</strong> Użyj danych przykładowych —
        niczego nie wysyłamy. Odpowiedzi pozostają tylko w pamięci tej strony.
      </div>
      {step < 3 && (
        <>
          <ol className="form-progress" aria-label={`Krok ${step + 1} z 3`}>
            {[0, 1, 2].map((n) => (
              <li
                key={n}
                className={step >= n ? 'active' : ''}
                aria-current={step === n ? 'step' : undefined}
              >
                <span className="sr-only">Krok {n + 1}</span>
              </li>
            ))}
          </ol>
          <p className="step-label" aria-live="polite">
            KROK 0{step + 1} / 03 ·{' '}
            {['TWÓJ POMYSŁ', 'PUNKT WYJŚCIA', 'PODSUMOWANIE'][step]}
          </p>
        </>
      )}
      {step < 3 ? (
        <form
          key={step}
          className="brief-step"
          method="dialog"
          noValidate
          onSubmit={next}
        >
          {step === 0 && (
            <fieldset aria-describedby={errors.type ? 'type-error' : undefined}>
              <legend>Co planujesz?</legend>
              <div className="choice-grid">
                {types.map(([value, label], i) => (
                  <label className="choice" key={value}>
                    <input
                      id={i === 0 ? 'type' : undefined}
                      type="radio"
                      disabled={!ready}
                      name="type"
                      value={value}
                      checked={data.type === value}
                      onChange={() => change('type', value)}
                      aria-invalid={!!errors.type}
                      aria-describedby={errors.type ? 'type-error' : undefined}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              {errors.type && (
                <p className="field-error" id="type-error" role="alert">
                  {errors.type}
                </p>
              )}
            </fieldset>
          )}
          {step === 1 && (
            <>
              <fieldset
                aria-describedby={errors.stage ? 'stage-error' : undefined}
              >
                <legend>Na jakim jesteś etapie?</legend>
                <div className="form-fields" style={{ marginTop: 0, gap: 10 }}>
                  {stages.map((value, i) => (
                    <label className="choice" key={value}>
                      <input
                        id={i === 0 ? 'stage' : undefined}
                        type="radio"
                        disabled={!ready}
                        name="stage"
                        value={value}
                        checked={data.stage === value}
                        onChange={() => change('stage', value)}
                        aria-invalid={!!errors.stage}
                        aria-describedby={
                          errors.stage ? 'stage-error' : undefined
                        }
                      />
                      <span>{value}</span>
                    </label>
                  ))}
                </div>
                {errors.stage && (
                  <p className="field-error" id="stage-error" role="alert">
                    {errors.stage}
                  </p>
                )}
              </fieldset>
              <div className="form-fields">
                <div>
                  <label className="field-label" htmlFor="description">
                    Co jest dla Ciebie ważne? <span>opcjonalnie</span>
                  </label>
                  <textarea
                    id="description"
                    maxLength={1500}
                    value={data.description}
                    onChange={(e) => change('description', e.target.value)}
                    placeholder="Np. więcej miejsca na książki, jasne drewno, schowane drobiazgi…"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="deadline">
                    Preferowany termin <span>opcjonalnie</span>
                  </label>
                  <input
                    id="deadline"
                    type="text"
                    maxLength={100}
                    value={data.deadline}
                    onChange={(e) => change('deadline', e.target.value)}
                    placeholder="Np. wiosna przyszłego roku — bez sprawdzania dostępności"
                  />
                </div>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2>Sprawdź swój pomysł.</h2>
              {summary()}
              <div className="form-fields">
                <div>
                  <label className="field-label" htmlFor="name">
                    Przykładowe imię
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="off"
                    maxLength={80}
                    value={data.name}
                    onChange={(e) => change('name', e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    placeholder="Anna"
                    required
                  />
                  {errors.name && (
                    <p className="field-error" id="name-error" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="field-label" htmlFor="email">
                    Przykładowy e-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="off"
                    inputMode="email"
                    maxLength={200}
                    value={data.email}
                    onChange={(e) => change('email', e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={
                      errors.email ? 'email-error' : 'email-help'
                    }
                    placeholder="anna@example.com"
                    required
                  />
                  <p
                    id="email-help"
                    className="step-label"
                    style={{ marginTop: 8, marginBottom: 0, letterSpacing: 0 }}
                  >
                    Użyj np. adresu anna@example.com. Nie podawaj prawdziwych
                    danych.
                  </p>
                  {errors.email && (
                    <p className="field-error" id="email-error" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
          <div className="form-actions">
            {step > 0 ? (
              <button
                type="button"
                className="back-button"
                onClick={() => {
                  setStep((n) => n - 1);
                  setErrors({});
                }}
              >
                ← Wróć
              </button>
            ) : (
              <span
                className="step-label"
                style={{ margin: 0, letterSpacing: 0 }}
              >
                Zacznij od jednej myśli.
              </span>
            )}
            <button className="button" type="submit" disabled={!ready}>
              {step === 2 ? 'Zobacz podsumowanie' : 'Dalej'}{' '}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="form-done">
          <div className="form-success-icon" aria-hidden="true">
            ✓
          </div>
          <h2>Twój pomysł ma już kształt.</h2>
          <p>
            Oto podsumowanie Twoich odpowiedzi. To koniec demonstracji — niczego
            nie wysłaliśmy.
          </p>
          {summary(true)}
          <div className="form-actions">
            <button
              className="back-button"
              type="button"
              onClick={() => setStep(0)}
            >
              ← Zmień odpowiedzi
            </button>
            <button
              className="button button-outline"
              type="button"
              onClick={() => {
                setData(empty);
                setErrors({});
                setStep(0);
              }}
            >
              Zacznij od nowa
            </button>
          </div>
        </div>
      )}
      <noscript>
        <p>
          Włącz JavaScript, aby przejść przez formularz demonstracyjny. Dane nie
          są wysyłane.
        </p>
      </noscript>
    </div>
  );
}
