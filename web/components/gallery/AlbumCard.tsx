import Link from "next/link";
import Image from "next/image";
import type { PhotoAlbum } from "@/lib/data/gallery";

type AlbumCardProps = {
  album: PhotoAlbum;
};

export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link
      href={`/gallery/${album.id}`}
      className="group relative block overflow-hidden rounded-xl border border-[var(--border)] bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <Image
          src={album.coverImageUrl}
          alt={album.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        <div className="absolute bottom-1 left-1 sm:bottom-1.5 sm:left-1.5 md:bottom-2 md:left-2 rounded-full bg-black/60 px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-2.5 md:py-1 text-[9px] sm:text-[10px] md:text-xs font-semibold text-white backdrop-blur-sm">
          {album.imageCount} تصویر
        </div>
      </div>
      <div className="p-2 sm:p-2.5 md:p-3">
        <h3 className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-900 line-clamp-2 leading-4 sm:leading-5 md:leading-6" style={{ color: '#0f172a' }}>
          {album.title}
        </h3>
        <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] md:text-xs text-slate-600">{album.publishedAt}</p>
      </div>
    </Link>
  );
}

