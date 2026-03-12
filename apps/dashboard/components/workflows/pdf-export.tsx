"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface Props {
  executionId: string;
}

export function PdfExport({ executionId }: Props) {
  const handleExport = async () => {
    try {
      const res = await fetch(`/api/v1/export/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ execution_id: executionId }),
      });

      if (res.ok) {
        const data = await res.json();
        window.location.href = data.download_url;
        toast.success("PDF export started");
      } else {
        toast.error("Export failed");
      }
    } catch (error) {
      toast.error("Export failed");
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="h-4 w-4 mr-2" /> PDF
    </Button>
  );
}
