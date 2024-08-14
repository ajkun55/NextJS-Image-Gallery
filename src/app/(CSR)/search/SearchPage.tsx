"use client";

import { UnsplashImage } from "@/models/unsplash-image";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import styles from "./SearchPage.module.css";

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<UnsplashImage[] | null>(
    null
  );
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);
  const [searchResultsLoadingError, setSearchResultsLoadingError] =
    useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get("query")?.toString().trim();

    if (query) {
      try {
        setSearchResults(null);
        setSearchResultsLoadingError(false);
        setSearchResultsLoading(true);

        const response = await fetch("/api/search/?query=" + query);
        const images: UnsplashImage[] = await response.json();
        setSearchResults(images);
      } catch (error) {
        console.error(error);
        setSearchResultsLoadingError(true);
      } finally {
        setSearchResultsLoading(false);
      }
    }
  }

  return (
    <div>
      <Alert>
        This page fetch data from <strong>client side</strong>. To not leak API
        information, the request is sent to NextJS{" "}
        <strong>route handler</strong> that runs on server. The rout handler
        fetch data from API then send back to client.
      </Alert>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="search-input">
          <Form.Label>Search Query</Form.Label>
          <Form.Control name="query" placeholder="E.g. cats sun"></Form.Control>
        </Form.Group>
        <Button type="submit" className="mb-3" disabled={searchResultsLoading}>
          Search
        </Button>
      </Form>

      <div className="d-flex flex-column align-items-center">
        {searchResultsLoading && <Spinner animation="border" />}
        {searchResultsLoadingError && (
          <p>Something went wrong, please try again.</p>
        )}
        {searchResults?.length === 0 && (
          <p>Nothing found. Try a different query.</p>
        )}
      </div>

      {searchResults && (
        <>
          {searchResults.map((image) => {
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
        </>
      )}
    </div>
  );
}
