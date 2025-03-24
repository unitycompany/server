import { IncomingForm } from "formidable";
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";

// Desativa o parser padrão de corpo do Vercel para essa função
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  // Faz o parse do form multipart
  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Erro ao fazer parse do form:", err);
      res.status(500).json({ error: "Erro no processamento do form" });
      return;
    }

    // Supondo que o campo de upload seja chamado "file"
    const file = files.file;
    if (!file) {
      res.status(400).json({ error: "Nenhum arquivo enviado" });
      return;
    }

    try {
      const fileStream = fs.createReadStream(file.filepath);
      const formData = new FormData();
      formData.append("file", fileStream, file.originalFilename);
      formData.append("upload_preset", process.env.CLOUDFLARE_UPLOAD_PRESET);

      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
      const apiToken = process.env.CLOUDFLARE_API_TOKEN;

      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        // Seleciona a variante "public" ou a primeira variante disponível
        const publicUrl =
          data.result.variants.find((url) => url.includes("public")) ||
          data.result.variants[0];
        res.status(200).json({ url: publicUrl });
      } else {
        console.error("Upload falhou:", data);
        res.status(500).json({ error: "Upload falhou", details: data });
      }
    } catch (uploadError) {
      console.error("Erro no upload:", uploadError);
      res.status(500).json({ error: "Erro no upload", details: uploadError.message });
    }
  });
}
