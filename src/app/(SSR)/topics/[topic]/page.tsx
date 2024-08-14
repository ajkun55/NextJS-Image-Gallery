import { UnsplashImage } from "@/models/unsplash-image";
import Image from "next/image";
import styles from "./TopicPage.module.css";
import { Alert } from "@/components/bootstrap";
import { Metadata } from "next";

interface PageProps {
  params: { topic: string };
}

export const dynamicParams = false;

export function generateMetadata({ params: { topic } }: PageProps): Metadata {
  return {
    title: topic + "NextJS Images Gallery App",
  };
}

export function generateStaticParams() {
  return ["health", "coding", "fitness", "books"].map((topic) => ({ topic }));
}

export default async function page({ params: { topic } }: PageProps) {
  const response = await fetch(
    `https://api.unsplash.com/photos/random?quesr=${topic}&count=30&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  );
  const images: UnsplashImage[] = await response.json();

  return (
    <div>
      <Alert>
        This page uses <strong>generateStaticParams</strong> to render and cache
        static pages at build time, even though the URL has dynamic parameters,
        pages that are not included in generateStaticParams will be fetched and
        rendered at first access and then{" "}
        <strong>cached for subsequent requests</strong>
      </Alert>

      <h1>{topic}</h1>
      {images.map((image) => {
        return (
          <Image
            src={image.urls.raw}
            width={250}
            height={250}
            alt={image.description || ""}
            className={styles.image}
            key={image.urls.raw}
          />
        );
      })}
    </div>
  );
}
