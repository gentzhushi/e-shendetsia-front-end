const recetaMjeksore = (patient, allergyAl, doctorName, prescription) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receta Mjeksore</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 10pt;
      margin: 0;
      padding: 20px;
      width: 210mm; /* A4 width */
      height: 297mm; /* A4 height */
      box-sizing: border-box;
      position: relative;
      border: 1px solid #000; /* Border around the document */
      overflow: auto; /* Prevent content overflow */
    }
    div, table {
      position: relative; /* Ensure elements stay in document flow */
      clear: both; /* Prevent floating issues */
    }
    .rp-label {
      position: absolute;
      left: -40px;
      top: 50%;
      transform: rotate(-90deg);
      font-size: 24pt;
      font-weight: bold;
      color: #000;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header h1 {
      font-size: 14pt;
      font-weight: bold;
      margin: 0;
    }
    .header p {
      font-size: 12pt;
      margin: 5px 0 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
    }
    th, td {
      border: 1px solid #000;
      padding: 5px;
      text-align: left;
    }
    th {
      background-color: #e0e0e0;
      font-weight: bold;
    }
    .checkbox-section th, .checkbox-section td {
      text-align: center;
    }
    ul {
      margin: 0;
      padding-left: 20px;
    }
    .footer {
      margin-top: 20px;
    }
    .footer table {
      width: 100%;
    }
    .footer th, .footer td {
      text-align: center;
    }
    @media print {
      body {
        margin: 0;
        border: none;
      }
      .rp-label {
        left: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="rp-label">RP</div>
  <div class="header">
    <h4>QEVERIA E KOSOVËS | MINISTRIA E SHËNDETËSISË</h4>
    <h1>RECETË PËR BARNA</h1>
  </div>

  <table>
    <tr>
      <th style="width: 25%;">Emri i Pacientit</th>
      <td style="width: 65%;">${patient.name}</td>
      <td style="width: 10%;"></td>
    </tr>
    <tr>
      <th>Nr. i Identitetit</th>
      <td>${patient.id}</td>
      <td></td>
    </tr>
    <tr>
      <th>Adresa</th>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>Nr. i Sigurimit</th>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>Emri i Mjekut</th>
      <td>${doctorName}</td>
      <td></td>
    </tr>
    <tr>
      <th>Adresa e Mjekut</th>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>Data</th>
      <td>${prescription.date}</td>
      <td></td>
    </tr>
  </table>

  <table class="checkbox-section">
    <tr>
      <th style="width: 25%;"></th>
      <th>Diabeti</th>
      <th>Shtatzëna</th>
      <th>Kronik</th>
      <th>HIV</th>
      <th>Tuberk.</th>
      <th>Kancer</th>
    </tr>
    <tr>
      <td></td>
      <td>[ ]</td>
      <td>[ ]</td>
      <td>[ ]</td>
      <td>[ ]</td>
      <td>[ ]</td>
      <td>[ ]</td>
    </tr>
  </table>

  <table>
    <tr>
      <th style="width: 25%;">Medikamenti</th>
      <td style="width: 65%;">${prescription.medication}</td>
      <td style="width: 10%;"></td>
    </tr>
    <tr>
      <th>Dozimi</th>
      <td>${prescription.dosage}</td>
      <td></td>
    </tr>
    <tr>
      <th>Frekuenca</th>
      <td>${prescription.frequency}</td>
      <td></td>
    </tr>
    <tr>
      <th>Kohëzgjatja</th>
      <td>${prescription.duration}</td>
      <td></td>
    </tr>
    <tr>
      <th>Sasia</th>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>Instruksionet</th>
      <td></td>
      <td></td>
    </tr>
  </table>

  <table>
    <tr>
      <th style="width: 25%;">Diagnoza</th>
      <td></td>
    </tr>
  </table>

  <div style="margin-top: 15px; margin-bottom: 20px; position: relative; z-index: 1;">
    <strong style="font-size: 12pt; font-weight: bold;">Alergjitë:</strong>
    <ul style="font-size: 12pt; line-height: 1.5; padding-left: 25px; margin: 5px 0;">
      ${patient.allergies.map(allergy => `<li>${allergyAl[allergy] || allergy}</li>`).join('')}
      ${patient.allergies.length === 0 ? `<li>Asnjë</li>` : ``}
    </ul>
  </div>

  <table>
    <tr>
      <th style="width: 25%;">Shënime të Tjera</th>
      <td></td>
    </tr>
  </table>

</body>
</html>
  `.trim();
};

export { recetaMjeksore };