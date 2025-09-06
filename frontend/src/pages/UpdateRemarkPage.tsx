//Page 2:Update remark for a configuration id.
//If PUT returns 404,display "config doesnt exist".

import { useState, type JSX } from "react";

//shadcn components
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";

//backend URL
const API_BASE = (import.meta.env as any).VITE_BACKEND_URL || "";

function configUrl(id: string) {
  return `${API_BASE}/api/configurations/${encodeURIComponent(id.trim())}`;
}

export default function UpdateRemarkPage(): JSX.Element {
  const [id, setId] = useState<string>("qwertyuiop");
  const [remark, setRemark] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);

    //validation for remark
    if (!remark.trim()) {
      setError("Type some remark before submit");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(configUrl(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remark }),
      });

      if (res.status === 404) {
        setError(`config doesnt exist`);
        return;
      }

      if (!res.ok) {
        const txt = await res.text();
        setError(`Failed to update remark:${res.status} ${txt}`);
        return;
      }

      const json = await res.json();
      if (json?.message === "success") {
        setSuccess("success");
      } else {
        setError(`Unexpected server response`);
      }
    } catch (err: any) {
      setError(`Network error:${err?.message || String(error)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Remark</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="configId">Config to update(configId):</Label>
            <Input
              id="configId"
              value={id}
              onChange={(e: any) => setId(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="remark">Remark</Label>
            <Textarea
              id="remark"
              value={remark}
              onChange={(e: any) => setRemark(e.target.value)}
              rows={5}
              className="mt-1"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Submit"}
            </Button>
          </div>

          <p>
            Click the "Submit" button - the configId and remark will be "PUT" on
            api "{API_BASE}/api/configurations/{id}" and remark field gets
            updated for the provided configId
          </p>

          {error && <div className="text-red-600 font-medium">{error}</div>}
          {success && (
            <>
              <strong className="text-3xl break-all">
                PUT: {API_BASE}/api/configurations/{id}
              </strong>
              <div className="text-green-600 font-medium">{success}</div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
