import Image from "next/image";

type PlayerAvatarProps = {
  photoUrl: string;
  name: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function PlayerAvatar({ photoUrl, name, size = "md" }: PlayerAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`relative ${sizeClasses[size]} flex-shrink-0 overflow-hidden rounded bg-slate-100`}>
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={name}
          fill
          className="object-cover"
          sizes={`${size === "sm" ? "32px" : size === "md" ? "40px" : "48px"}`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-600">
          {initials}
        </div>
      )}
    </div>
  );
}

