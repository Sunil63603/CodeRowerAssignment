//Page 1: Fetch configuration by id and display results.
//If no document found -> shows red message:"no config with this id:{id}"

import { useState, type JSX } from "react";

//shadcn imports
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";

//backend URL is used to fetch config from database.
const API_BASE = (import.meta.env as any).VITE_BACKEND_URL || "";

//constructs proper URL for fetch()
function configUrl(id: string) {
  return `${API_BASE}/api/configurations/${encodeURIComponent(id.trim())}`;
}

export default function GetConfigPage(): JSX.Element {
  const [id, setId] = useState<string>("qwertyuiop");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<any | null>(null);
  const [matrix, setMatrix] = useState<any[] | null>(null);

  async function fetchConfig(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setConfig(null);
    setMatrix(null);

    try {
      const res = await fetch(configUrl(id));

      if (res.status === 404) {
        setError(`no config with this id:${id}`);
        return;
      }

      if (!res.ok) {
        const txt = await res.text();
        setError(`Failed to fetch config:${res.status} ${txt}`);
        return;
      }

      const payload = await res.json();
      if (Array.isArray(payload)) {
        setMatrix(payload);
        setConfig({ configurationId: id, matrix: payload });
      } else {
        setConfig(payload);
        if (payload?.matrix && Array.isArray(payload.matrix))
          setMatrix(payload.matrix);
      }
    } catch (error: any) {
      setError(`Network error:${error.message || String(error)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fetch Config</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={fetchConfig} className="space-y-4">
          <div>
            <Label htmlFor="configId">Config to load(configId): </Label>
            <Input
              id="configId"
              value={id}
              onChange={(e: any) => setId(e.target.value)}
              className="mt-1"
            ></Input>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} aria-label="submit-button">
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>

          <p>
            Click the "submit" button and the configId with this will get from "
            {API_BASE}/api/configurations/id" and shown below
          </p>

          {error && <div className="text-red-600 font-medium">{error}</div>}

          {config && (
            <>
              <strong className="text-3xl">
                Result: {API_BASE}/api/configurations/{id}
              </strong>

              <div className="mt-4">
                <div>
                  <div className="mt-2 overflow-auto max-h-58 rounded p-2 bg-white">
                    {matrix ? (
                      <div className="font-semibold text-lg whitespace-pre-line">
                        {matrix
                          .slice(0, 3)
                          .map((row: any[]) => row.slice(0, 3).join(", ") + ",")
                          .join("\n")}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No matrix
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
