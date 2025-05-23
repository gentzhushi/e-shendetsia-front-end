<p align="center">
  <a href="https://fiek.uni-pr.edu/">
    <img src="/src/assets/logo1.png" alt="Logo" height="40">
  </a>

<h3 align="center">e-shendetsia</h3>
</p>

## Përmbledhje

**e-shendetsia** është një web-aplikacion i ndërtuar me React.js në front-end dhe Java Spring Boot në back-end, që synon të ofrojë një ndërfaqe të avancuar dhe efikase për sistemin shëndetësor digjital. Aplikacioni përfshin role të ndryshme si **mjekë** dhe **pacientë**:

- **Mjekët** mund të menaxhojnë profilet e pacientëve, të leshojne dhe shkarkojne receta mjeksore ne form PDF, të konsultojnë historikun e mëparshëm mjekësor dhe të ndjekin vizitat e ardhshme.
- **Pacientët** kanë mundësi të caktimit të takimeve në orare të deshiruara, në spitale të caktuara dhe me mjekë specifikë.

Ky sistem dixhital përmirëson dhe automatizon procesin e rezervimit të takimeve mjekësore, duke e bërë atë më **efikas**, **të sigurt** dhe **më të lehtë** për të dy palët – stafin mjeksorë dhe pacientët.

<br><br>

## Karakteristikat

- **Konfigurim Dinamik:** Lejon ndryshimin e parametrave pa modifikuar kodin, përmes `config.yml`.
- **Arkitekturë Modulare:** Kodimi është i ndarë në komponentë në `src/`.
- **Integrim me API:** Lidhja me komunikimin me shërbime të back-end projektit përmes HTTP requests.
- **UI Responsive:** Ndërfaqe e ndërtuar për të qenë funksionale në pajisje të ndryshme.

<br><br>

## Struktura e Projektit

- `public/` – Fajllat publikë që ngarkohen drejtpërdrejt nga browseri.
- `src/` – Të gjithë komponentët React dhe logjika e aplikacionit.
- `config.yml` – Fajlli i konfigurimit për endpoints.
- `loadConfig.js` – Funksionalitet për të lexuar `config.yml` dhe vendosur variabla.
- `package.json` – Varësitë dhe skriptat e projektit.

<br><br>

## Kushtet paraprake

Sigurohuni të keni të instaluar:

- [Node.js dhe npm](https://nodejs.org/en/download/)

Kontrolloni instalimin me komandat:

```bash
node -v
npm -v
```

<br>

## Instalimi

Klononi projektin dhe instaloni:

```bash
git clone https://github.com/gentzhushi/e-shendetsia-front-end
cd e-shendetsia-front-end
npm install
```

Në rast se `npm install` dështon:

```bash
npm install --legacy-peer-deps
```

<br>

## Ekzekutimi

Për të nisur aplikacionin lokal:

```bash
npm start
```

Aplikacioni do të hapet automatikisht në browserin tuaj në:  
[http://localhost:3000](http://localhost:3000)


<br><br>

## Punuan:
- Gent Zhushi, Endrit Kastrati, Etnik Kelmendi dhe Euron Osmani.

<a href="#top">Shko në fillim ↑</a>
