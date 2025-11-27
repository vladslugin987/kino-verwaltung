# Kino-Verwaltungssystem

Eine Web-Anwendung zur Verwaltung eines Kinos mit Funktionen für Betreiber und Kunden.

## Team

- Vladislav Slugin
- Sofie Halbedl

## Projektbeschreibung

Diese Anwendung ermöglicht die Verwaltung von Kinosälen, Vorstellungen und Reservierungen. Das System besteht aus einem Node.js/Express-Backend mit MongoDB-Persistierung und einer browserbasierten Frontend-Anwendung.

### Funktionen

#### Für Betreiber
- Kinosäle anlegen
- Vorstellungen anlegen

#### Für Kunden
- Sitzplätze für Vorstellungen reservieren
- QR-Codes für Reservierungen generieren und ausdrucken

## Technologie-Stack

- **Backend**: Node.js, Express
- **Datenbank**: MongoDB
- **Frontend**: Vanilla JavaScript (ES Modules), HTML, CSS
- **Build-Tools**: esbuild, Less, lessc
- **Code-Qualität**: semistandard

## Installation & Verwendung

> **Hinweis**: Das Projekt befindet sich aktuell in der Entwicklung. Die folgenden Befehle werden im Laufe der Entwicklung implementiert.

### Voraussetzungen

- Node.js (aktuelle Version)
- MongoDB
- npm

### Setup

```bash
# Abhängigkeiten installieren
npm install

# Projekt bauen
npm run build

# Server starten (Port 8080)
npm start
```

### Verfügbare npm-Skripte

```bash
npm run clean    # Projekt bereinigen (generierte Dateien löschen)
npm run lint     # Code-Qualität mit semistandard prüfen
npm run debug    # Projekt im Debug-Modus bauen
npm run build    # Projekt bauen (mit Minifizierung und Obfuskierung)
npm start        # Server an Port 8080 starten
```

### Server mit benutzerdefiniertem Port starten

```bash
node server/server.js <PORT>
```

## Anforderungen

- Browser-Kompatibilität: Google Chrome und Mozilla Firefox (aktuelle Versionen)
- Kein TypeScript
- Kein MV*-Framework (Angular, React, Vue.js) oder jQuery
- ESM-Module mit esbuild
- semistandard-konforme Code-Qualität
- REST-konforme HTTP-Schnittstelle
- Paginierung von Listen basierend auf Fenstergröße

## Datenmodelle

### Kinosaal
- Name
- Anzahl Sitzreihen
- Anzahl Sitze pro Sitzreihe

### Vorstellung
- Datum und Uhrzeit
- Kinosaal
- Name des Films

### Reservierung
- Vorstellung
- Reservierte Sitzplätze
- Name des Kunden

## Zeitplan

- **Studienleistung**: Abgabe bis 05.01.2026
- **Prüfung**: Abgabe bis 28.02.2026

## Hinweise

- Es ist keine Authentifizierung oder Benutzerverwaltung erforderlich
- Alle Nutzer können alle Ressourcen erstellen und einsehen
- Nachträgliches Bearbeiten oder Löschen von Daten ist nicht vorgesehen
- Listen werden dynamisch basierend auf der Fenstergröße paginiert

## Entwicklungsstatus

- [x] Repository eingerichtet
- [x] README erstellt
- [x] Grundgerüst der Anwendung
- [x] Build-Prozess implementiert
- [x] Server-Setup
- [ ] MongoDB-Integration
- [ ] REST-API
- [ ] Frontend-Grundstruktur
- [ ] Kinosaal-Verwaltung
- [ ] Vorstellungs-Verwaltung
- [ ] Reservierungssystem
- [ ] QR-Code-Generierung
- [ ] Paginierung

---

**Hochschule Trier**  
**Autoren**: [Vladislav Slugin](https://github.com/vladslugin987) (Informatik), [Sofie Halbedl](https://github.com/Sofotschka) (Medizininformatik)  
**Semester**: WS 2025/26
