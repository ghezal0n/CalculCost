// pdfScraper.js - Module pour scrapper les données PDF de Koper

import * as pdfjsLib from "pdfjs-dist";

// Configuration des workers pour PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

class KoperPDFScraper {
  constructor() {
    this.scrapedData = [];
    this.isLoaded = false;
  }

  /**
   * Parse le contenu PDF et extrait les données
   * @param {File} pdfFile - Le fichier PDF à analyser
   */
  async parsePDF(pdfFile) {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

      let allText = "";

      // Extraire le texte de toutes les pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        allText += pageText + "\n";
      }

      // Parser les données extraites
      this.scrapedData = this.parseExtractedText(allText);
      this.isLoaded = true;

      return this.scrapedData;
    } catch (error) {
      console.error("Erreur lors du parsing du PDF:", error);
      throw new Error("Impossible de lire le fichier PDF");
    }
  }

  /**
   * Parse le texte extrait et structure les données
   * @param {string} text - Texte extrait du PDF
   */
  parseExtractedText(text) {
    const lines = text.split("\n").filter((line) => line.trim().length > 0);
    const data = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Rechercher les lignes contenant des données de destination
      // Adapté selon le format de votre PDF
      if (this.isDataLine(line)) {
        const parsedData = this.parseDataLine(line, lines, i);
        if (parsedData) {
          data.push(parsedData);
        }
      }
    }

    return data;
  }

  /**
   * Vérifie si une ligne contient des données à extraire
   * @param {string} line - Ligne à vérifier
   */
  isDataLine(line) {
    // Critères pour identifier une ligne de données
    // À adapter selon le format de votre PDF
    return (
      line.includes("40'DB") || line.includes("TT") || /\d+\.\d+/.test(line) // Contient des prix (format decimal)
    );
  }

  /**
   * Parse une ligne de données spécifique
   * @param {string} line - Ligne à parser
   * @param {array} allLines - Toutes les lignes pour le contexte
   * @param {number} index - Index de la ligne courante
   */
  parseDataLine(line, allLines, index) {
    try {
      // Regex patterns à adapter selon votre format PDF
      const patterns = {
        destination: /([A-Z][A-Za-z\s]+)(?=\s+\d)/,
        carrier: /(MSC|CMA|MAERSK|HAPAG|ONE|COSCO|EVERGREEN)/i,
        price40DB: /40'?DB[\s:]*(\d+[.,]\d+|\d+)/,
        freetime: /TT[\s:]*(\d+)/,
        totalApprox: /total\s+approximatif[\s:]*(\d+[.,]\d+|\d+)/i,
      };

      const destination = this.extractWithPattern(line, patterns.destination);
      const carrier = this.extractWithPattern(line, patterns.carrier);

      // Chercher le prix 40'DB et TT dans la ligne courante ou suivantes
      let oceanFreight = this.extractPrice(line, allLines, index);
      let freetime = this.extractFreetime(line, allLines, index);

      // Si on trouve une destination valide
      if (destination && oceanFreight) {
        return {
          origin: "Koper",
          destination: destination.trim(),
          carrier: carrier || "TBD",
          oceanFreight: parseFloat(oceanFreight.replace(",", ".")),
          freetime: freetime ? `${freetime} days` : "TBD",
          validUntil: "31/12/2025", // À adapter selon vos besoins
        };
      }
    } catch (error) {
      console.warn("Erreur lors du parsing de la ligne:", line, error);
    }

    return null;
  }

  /**
   * Extrait les prix depuis les lignes
   */
  extractPrice(currentLine, allLines, currentIndex) {
    // Chercher 40'DB d'abord
    let price = this.extractWithPattern(
      currentLine,
      /40'?DB[\s:]*(\d+[.,]\d+|\d+)/
    );

    if (!price) {
      // Chercher dans "total approximatif"
      price = this.extractWithPattern(
        currentLine,
        /total\s+approximatif[\s:]*(\d+[.,]\d+|\d+)/i
      );
    }

    // Si pas trouvé sur la ligne courante, chercher dans les lignes suivantes (max 3)
    if (!price) {
      for (let i = 1; i <= 3 && currentIndex + i < allLines.length; i++) {
        const nextLine = allLines[currentIndex + i];
        price =
          this.extractWithPattern(nextLine, /40'?DB[\s:]*(\d+[.,]\d+|\d+)/) ||
          this.extractWithPattern(
            nextLine,
            /total\s+approximatif[\s:]*(\d+[.,]\d+|\d+)/i
          );
        if (price) break;
      }
    }

    return price;
  }

  /**
   * Extrait le freetime (TT)
   */
  extractFreetime(currentLine, allLines, currentIndex) {
    let freetime = this.extractWithPattern(currentLine, /TT[\s:]*(\d+)/);

    if (!freetime) {
      for (let i = 1; i <= 2 && currentIndex + i < allLines.length; i++) {
        const nextLine = allLines[currentIndex + i];
        freetime = this.extractWithPattern(nextLine, /TT[\s:]*(\d+)/);
        if (freetime) break;
      }
    }

    return freetime;
  }

  /**
   * Utilitaire pour extraire avec regex
   */
  extractWithPattern(text, pattern) {
    const match = text.match(pattern);
    return match ? match[1] : null;
  }

  /**
   * Retourne les données scrapées au format compatible avec Data.js
   */
  getScrapedData() {
    return this.scrapedData;
  }

  /**
   * Vérifie si les données sont chargées
   */
  isDataLoaded() {
    return this.isLoaded;
  }

  /**
   * Réinitialise les données
   */
  reset() {
    this.scrapedData = [];
    this.isLoaded = false;
  }
}

export default KoperPDFScraper;
