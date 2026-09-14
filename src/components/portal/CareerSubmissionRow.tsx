import { X } from "lucide-react";
import {
  CAREER_AVAILABILITY_LABELS,
  CAREER_EXPERIENCE_LABELS,
  CAREER_ROLE_LABELS,
  careerLabel,
} from "@/lib/careers";
import { deleteCareerSubmissionAction } from "@/lib/portal/actions";
import { formatWhen } from "@/lib/portal/dates";
import ActionForm from "@/components/portal/ActionForm";

export type CareerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  availability: string;
  experience: string;
  instagram: string;
  resumeUrl: string;
  message: string;
  createdAt: Date;
};

export default function CareerSubmissionRow({ submission }: { submission: CareerRow }) {
  const bits = [
    careerLabel(CAREER_AVAILABILITY_LABELS, submission.availability),
    careerLabel(CAREER_EXPERIENCE_LABELS, submission.experience),
    submission.city,
  ].filter(Boolean);

  return (
    <li className="rounded-2xl border border-ink/10 px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700">
            {careerLabel(CAREER_ROLE_LABELS, submission.role)}
          </p>
          <p className="mt-1 font-display text-2xl uppercase tracking-wide text-ink">
            {submission.name}
          </p>
          <p className="mt-1 text-sm text-ink/55">{formatWhen(submission.createdAt)}</p>
        </div>
        <ActionForm
          action={deleteCareerSubmissionAction}
          confirm={{
            title: "Remove this application?",
            message: `Are you sure you want to delete ${submission.name}'s application? This cannot be undone.`,
            confirmLabel: "Remove",
          }}
        >
          <input type="hidden" name="submissionId" value={submission.id} />
          <button
            type="submit"
            aria-label={`Remove ${submission.name}`}
            className="rounded-full border border-ink/10 p-2 text-ink/40 transition-colors hover:border-red-300 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </ActionForm>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/70">
        <a href={`mailto:${submission.email}`} className="hover:text-green-700">
          {submission.email}
        </a>
        {submission.phone ? (
          <a href={`tel:${submission.phone}`} className="hover:text-green-700">
            {submission.phone}
          </a>
        ) : null}
        {bits.map((bit) => (
          <span key={bit}>{bit}</span>
        ))}
      </div>

      {submission.instagram || submission.resumeUrl ? (
        <div className="mt-2 flex flex-wrap gap-x-4 text-sm">
          {submission.instagram ? (
            <span className="text-ink/60">{submission.instagram}</span>
          ) : null}
          {submission.resumeUrl ? (
            <a
              href={submission.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-green-700 hover:text-green-800"
            >
              Resume
            </a>
          ) : null}
        </div>
      ) : null}

      <p className="mt-3 text-sm leading-relaxed text-ink/70">{submission.message}</p>
    </li>
  );
}
