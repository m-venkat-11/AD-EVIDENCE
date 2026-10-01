import React from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  FileSearch, 
  Layers, 
  Database, 
  Sparkles, 
  Scale, 
  Fingerprint, 
  Share2 
} from 'lucide-react';

interface VerificationPipelineStepperProps {
  currentStage: number; // 1 to 10
  isProcessing: boolean;
  onRunPipeline: () => void;
}

export const PIPELINE_STAGES = [
  { id: 1, name: 'Input Intake', desc: 'SHA-256 asset hash & multi-format ingestion', icon: FileSearch },
  { id: 2, name: 'Normalization', desc: 'OCR text bounding & multimodal transcripts', icon: Layers },
  { id: 3, name: 'Identity Resolution', desc: 'Canonical GS1 GTIN & model match', icon: Fingerprint },
  { id: 4, name: 'Claim Extraction', desc: 'Atomic assertion & unit normalization', icon: Sparkles },
  { id: 5, name: 'Evidence Retrieval', desc: 'Authoritative, lab, retailer & consumer feeds', icon: Database },
  { id: 6, name: 'Deterministic Checks', desc: 'Exact numeric, range, price & freshness logic', icon: Scale },
  { id: 7, name: 'Provenance / C2PA', desc: 'Content Credentials & SynthID detection', icon: ShieldCheck },
  { id: 8, name: 'Cross-Source Decision', desc: 'Conflict resolution & status assignment', icon: Scale },
  { id: 9, name: '4-Question Report', desc: 'Explainable reasoning without hallucinations', icon: FileSearch },
  { id: 10, name: 'Passport & Graph', desc: 'Persistent record update across ad ecosystem', icon: Share2 },
];

export const VerificationPipelineStepper: React.FC<VerificationPipelineStepperProps> = ({
  currentStage,
  isProcessing,
  onRunPipeline,
}) => {
  return (
    <div className="pipeline-stepper-box glass-panel">
      <div className="stepper-header">
        <div className="stepper-title-wrap">
          <div className="stepper-icon-badge">
            <Sparkles size={18} color="#3D5AFE" />
          </div>
          <div>
            <h3 className="stepper-title">Intelligent Hybrid Verification Pipeline</h3>
            <p className="stepper-subtitle">
              Section 6 Architecture: <em>“Use AI for ambiguity; use code for certainty”</em>
            </p>
          </div>
        </div>

        <button 
          className="btn-pipeline-rerun" 
          onClick={onRunPipeline}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="spin-animation" />
              <span>Verifying Step {currentStage}/10...</span>
            </>
          ) : (
            <>
              <ShieldCheck size={16} />
              <span>Re-run Full 10-Step Pipeline</span>
            </>
          )}
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="stepper-track-container">
        <div className="stepper-connecting-bar">
          <div 
            className="stepper-active-beam"
            style={{ width: `${(Math.min(currentStage, 10) / 10) * 100}%` }}
          />
        </div>
        <div className="stepper-nodes-row">
          {PIPELINE_STAGES.map((stage) => {
            const Icon = stage.icon;
            const isCompleted = currentStage >= stage.id;
            const isCurrent = currentStage === stage.id && isProcessing;

            return (
              <div 
                key={stage.id} 
                className={`step-item ${stage.id === 10 ? 'step-10' : ''} ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
              >
                <div className="step-circle">
                  {stage.id === 10 ? (
                    <span>10</span>
                  ) : isCurrent ? (
                    <Loader2 size={15} className="spin-animation" />
                  ) : (
                    <Icon size={14} />
                  )}
                </div>
                <div className="step-name-text">{stage.name}</div>
                <div className="step-desc-text">{stage.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
