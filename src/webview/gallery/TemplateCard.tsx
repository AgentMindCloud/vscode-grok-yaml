import { Template, TemplateCategory } from './templates';
import { getVsCodeApi } from './vscode';

interface Props {
  template: Template;
}

const LABELS: Record<TemplateCategory, string> = {
  'voice-ready': 'Voice-Ready',
  'multi-agent-swarm': 'Swarm',
  beginner: 'Beginner',
  trending: 'Trending',
};

export function TemplateCard({ template }: Props) {
  const api = getVsCodeApi();

  const onClone = () => {
    api.postMessage({
      type: 'clone',
      templateId: template.id,
      files: template.files,
    });
  };

  const onInsert = () => {
    if (!template.snippet) return;
    api.postMessage({
      type: 'insert',
      snippet: template.snippet,
    });
  };

  const onPreview = () => {
    if (!template.previewUrl) return;
    api.postMessage({
      type: 'openExternal',
      url: template.previewUrl,
    });
  };

  return (
    <article className="template-card">
      <div className="template-card__header">
        <div className="template-card__title">{template.name}</div>
        <div className="template-card__badges">
          {template.categories.map((c) => (
            <span key={c} className={`badge badge--${c}`}>
              {LABELS[c]}
            </span>
          ))}
        </div>
      </div>
      <p className="template-card__description">{template.description}</p>
      <div className="template-card__footer">
        <button type="button" className="btn btn--primary" onClick={onClone}>
          Clone into workspace
        </button>
        {template.type === 'snippet' && (
          <button type="button" className="btn btn--secondary" onClick={onInsert}>
            Insert into current file
          </button>
        )}
        {template.previewUrl && (
          <button type="button" className="link" onClick={onPreview}>
            Preview on grokagents.dev
            <span className="link__icon" aria-hidden="true">
              &#8599;
            </span>
          </button>
        )}
      </div>
    </article>
  );
}
