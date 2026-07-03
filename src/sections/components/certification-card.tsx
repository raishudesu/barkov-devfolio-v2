const CertificationCard = ({
  title,
  description,
  imageLink,
}: {
  title: string;
  description: string;
  imageLink?: string | null;
}) => {
  return (
    <article className="border border-gray-200 rounded-xl p-5 bg-card shadow-[0_2px_8px_-4px_rgba(0,0,0,0.08)]">
      {imageLink && (
        <div className="mb-3 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={imageLink}
            alt={title}
            className="w-full object-cover"
          />
        </div>
      )}
      <h3 className="text-sm font-bold">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </article>
  );
};

export default CertificationCard;
