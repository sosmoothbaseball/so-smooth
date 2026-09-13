export default function ParentContact({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone?: string | null;
}) {
  return (
    <div className="mt-1 space-y-1">
      <p className="text-sm text-ink/60">Parent {name}</p>
      <p className="text-sm text-ink/70">
        <a href={`mailto:${email}`} className="hover:text-green-700">
          {email}
        </a>
        {phone ? (
          <>
            {" · "}
            <a href={`tel:${phone}`} className="hover:text-green-700">
              {phone}
            </a>
          </>
        ) : null}
      </p>
    </div>
  );
}
