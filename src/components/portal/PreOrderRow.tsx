import { X } from "lucide-react";
import { deletePreOrderAction } from "@/lib/portal/actions";
import { formatWhen } from "@/lib/portal/dates";
import ActionForm from "@/components/portal/ActionForm";

export type PreOrderRowData = {
  id: string;
  productName: string;
  name: string;
  email: string;
  phone: string;
  gloveSize: string;
  createdAt: Date;
};

export default function PreOrderRow({ order }: { order: PreOrderRowData }) {
  return (
    <li className="rounded-2xl border border-ink/10 px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700">
            {order.productName} · {order.gloveSize}
          </p>
          <p className="mt-1 font-display text-2xl uppercase tracking-wide text-ink">
            {order.name}
          </p>
          <p className="mt-1 text-sm text-ink/55">{formatWhen(order.createdAt)}</p>
        </div>
        <ActionForm
          action={deletePreOrderAction}
          confirm={{
            title: "Remove this pre-order?",
            message: `Are you sure you want to delete ${order.name}'s pre-order? This cannot be undone.`,
            confirmLabel: "Remove",
          }}
        >
          <input type="hidden" name="preOrderId" value={order.id} />
          <button
            type="submit"
            aria-label={`Remove ${order.name}`}
            className="rounded-full border border-ink/10 p-2 text-ink/40 transition-colors hover:border-red-300 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </ActionForm>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/70">
        <a href={`mailto:${order.email}`} className="hover:text-green-700">
          {order.email}
        </a>
        <a href={`tel:${order.phone}`} className="hover:text-green-700">
          {order.phone}
        </a>
        <span>Glove {order.gloveSize}</span>
      </div>
    </li>
  );
}
