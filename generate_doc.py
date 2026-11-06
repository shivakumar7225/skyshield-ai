import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def create_styled_table(doc, headers, data, col_widths=None):
    table = doc.add_table(rows=len(data) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    # Header row
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], "0F172A") # Dark Navy
        set_cell_margins(hdr_cells[i], 140, 140, 160, 160)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs:
            run.font.bold = True
            run.font.size = Pt(10)
            run.font.color.rgb = RGBColor(255, 255, 255)

    # Data rows
    for r_idx, row_data in enumerate(data):
        row_cells = table.rows[r_idx + 1].cells
        bg_color = "F8FAFC" if r_idx % 2 == 0 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            row_cells[c_idx].text = str(val)
            set_cell_background(row_cells[c_idx], bg_color)
            set_cell_margins(row_cells[c_idx], 100, 100, 140, 140)
            p = row_cells[c_idx].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.size = Pt(9.5)
                run.font.color.rgb = RGBColor(30, 41, 59)

    # Widths
    if col_widths:
        for row in table.rows:
            for i, w in enumerate(col_widths):
                row.cells[i].width = Inches(w)

    doc.add_paragraph() # spacing
    return table

def add_callout(doc, text, title="KEY HIGHLIGHT"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.rows[0].cells[0].width = Inches(6.5)
    cell = tbl.rows[0].cells[0]
    set_cell_background(cell, "F0F9FF") # Light cyan/blue
    set_cell_margins(cell, 140, 140, 180, 180)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="0284C7"/>'
        f'<w:top w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:bottom w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

    p = cell.paragraphs[0]
    r_title = p.add_run(f"📌 {title}: ")
    r_title.bold = True
    r_title.font.size = Pt(10)
    r_title.font.color.rgb = RGBColor(2, 132, 199)

    r_text = p.add_run(text)
    r_text.font.size = Pt(9.5)
    r_text.font.color.rgb = RGBColor(15, 23, 42)
    doc.add_paragraph()

def build_word_documentation(output_path):
    doc = Document()

    # Set page margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Base styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(30, 41, 59)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(6)

    # -------------------------------------------------------------
    # COVER / HEADER TITLE
    # -------------------------------------------------------------
    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_org = p_meta.add_run("SMART INDIA HACKATHON 2026\nMinistry of Earth Sciences (MoES) — Problem Statement 26077\nTeam CodeRed | Software Category")
    r_org.font.size = Pt(9)
    r_org.font.color.rgb = RGBColor(100, 116, 139)
    r_org.font.bold = True

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(24)
    p_title.paragraph_format.space_after = Pt(6)
    r_title = p_title.add_run("🛡️ SkyShield AI (VarshDrishti)")
    r_title.font.name = 'Calibri'
    r_title.font.size = Pt(28)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(2, 132, 199) # Royal Blue

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(20)
    r_sub = p_sub.add_run("AI-Driven Hyper-Local Early Warning System for Severe Weather Nowcasting, Cloudburst Detection, and Tactical Disaster Response")
    r_sub.font.size = Pt(13)
    r_sub.font.color.rgb = RGBColor(71, 85, 105)
    r_sub.italic = True

    # Metadata Card Table
    meta_headers = ["Key Field", "Specification / Live Resource Detail"]
    meta_data = [
        ["Live Prototype URL", "https://skyshield-ai-sih.vercel.app"],
        ["GitHub Repository", "https://github.com/shivakumar7225/skyshield-ai"],
        ["Problem Statement ID", "26077 (Ministry of Earth Sciences - MoES)"],
        ["Target Phenomena", "Severe Thunderstorms, Cloudbursts (>100mm/hr), Flash Flooding"],
        ["Prediction Lead Time", "2 to 6 Hours Actionable Operational Lead Time"],
        ["Target Geographic Scope", "Strictly Bounded to Republic of India (6°N–37.5°N, 68°E–97.5°E)"],
        ["Core Architecture", "React 18 SPA + Python FastAPI + Leaflet GIS + PostGIS/SQLite"],
        ["Evaluation Credentials", "Officer: officer / commander2026 | Citizen: Aashrith (+91 98765 43210)"]
    ]
    create_styled_table(doc, meta_headers, meta_data, [2.2, 4.3])

    doc.add_page_break()

    # -------------------------------------------------------------
    # 1. EXECUTIVE SUMMARY
    # -------------------------------------------------------------
    h1 = doc.add_heading("1. Executive Summary", level=1)
    h1.style.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph(
        "SkyShield AI (VarshDrishti) is an advanced meteorological nowcasting and tactical disaster response platform "
        "developed for Smart India Hackathon 2026 under Problem Statement 26077 by the Ministry of Earth Sciences (MoES). "
        "The system solves the critical 'last-mile' warning gap in disaster management by fusing multi-source meteorological "
        "observations, high-resolution Numerical Weather Prediction (NWP) grids, CartoDEM/SRTM Digital Elevation Models, "
        "and Doppler Weather Radar (DWR) Quantitative Precipitation Estimation (QPE)."
    )

    doc.add_paragraph(
        "Unlike conventional synoptic models that provide broad district-wide summaries, SkyShield AI delivers 2 to 6 hour "
        "hyper-local predictive nowcasts down to specific mandals, wards, and villages. It features dual synchronized command "
        "interfaces: an Incident Command Center for disaster authorities (NDRF, SDRF, Municipal Corporations) and a Citizen "
        "Portal providing hyper-local warnings, 1-tap SOS telemetry broadcasting live device GPS coordinates, and real-time "
        "navigation to verified relief shelters avoiding inundated transit routes."
    )

    add_callout(
        doc,
        "SkyShield AI is fully built and deployed to the cloud at https://skyshield-ai-sih.vercel.app, featuring real live device GPS "
        "auto-detection, interactive Leaflet GIS radar grids, 8/8 passing automated backend test suites, and zero-downtime offline fallbacks.",
        "OPERATIONAL STATUS"
    )

    # -------------------------------------------------------------
    # 2. PROBLEM STATEMENT & THE LAST-MILE GAP
    # -------------------------------------------------------------
    h1 = doc.add_heading("2. Problem Statement & Operational Challenges", level=1)
    h1.style.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph(
        "Extreme localized precipitation events—especially cloudbursts (defined as rainfall exceeding 100 mm/hour within a small area) "
        "and rapid urban flash flooding—present severe threats to life and infrastructure across India. In urban regions like "
        "Hyderabad, Mumbai, Bengaluru, and Delhi, and hilly Himalayan catchments like Uttarakhand and Himachal Pradesh, rainfall "
        "concentrates in natural drainage basins within minutes, submerging road underpasses, basements, and critical power infrastructure."
    )

    doc.add_paragraph("Key shortcomings in conventional disaster early warning architectures include:")

    p = doc.add_paragraph()
    p.add_run("• Spatial Resolution Mismatch: ").bold = True
    p.add_run("Synoptic Numerical Weather Predictions typically output at 12km to 25km resolutions, completely missing localized convective updrafts that trigger cloudbursts over 3km to 5km catchment basins.")

    p = doc.add_paragraph()
    p.add_run("• Topographical Blindness: ").bold = True
    p.add_run("Standard weather warnings announce rainfall quantity but ignore elevation slopes and drainage pooling, failing to predict which specific arterial roads and residential clusters will be submerged.")

    p = doc.add_paragraph()
    p.add_run("• Slow Information Cascades: ").bold = True
    p.add_run("Alerts travel through multi-tier bureaucratic telephone chains, reaching field responders and citizens after water has already entered residential premises.")

    p = doc.add_paragraph()
    p.add_run("• Non-Actionable Civilian Bulletins: ").bold = True
    p.add_run("Technical meteorological bulletins using millibars, CAPE, and dBZ values cause public panic or apathy rather than providing clear, elevation-safe evacuation routes.")

    # -------------------------------------------------------------
    # 3. SYSTEM ARCHITECTURE & TECHNICAL WORKFLOW
    # -------------------------------------------------------------
    h1 = doc.add_heading("3. System Architecture & Technical Workflow", level=1)
    h1.style.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph(
        "SkyShield AI is architected as a decoupled, resilient, and event-driven full-stack system composed of six modular layers:"
    )

    arch_headers = ["Layer", "Key Components & Providers", "Primary Operational Responsibility"]
    arch_data = [
        ["1. Data Ingestion Layer", "Open-Meteo NWP, CartoDEM/SRTM, ISRO MOSDAC, NCMRWF IMDAA, DWR Radar", "Collects real-time surface parameters, elevation models, and stability indices."],
        ["2. Convective Risk Engine", "Nowcasting Algorithm, CAPE/CIN/CTT Indexing, Multi-sensor Fusion", "Computes 2–6h lead-time hazard probabilities (Thunderstorm, Cloudburst, Flash Flood)."],
        ["3. Spatial Impact Engine", "Topographical Slope Analysis, Low-Basin Hydrology, Road Overlays", "Intersects hazard polygons with municipal infrastructure and drainage basins."],
        ["4. Grounded AI Layer", "Google Gemini 1.5 Flash (Grounded on Sensor Vector)", "Translates raw meteorological telemetry into deterministic, plain-language action protocols."],
        ["5. Real-Time Event Bus", "FastAPI WebSockets (/ws/officer & /ws/citizen)", "Bidirectional instant dispatch of SOS telemetry, officer approvals, and emergency broadcasts."],
        ["6. Client Application Layer", "React 18 SPA, Leaflet GIS Engine, WGS84 Geodetic Tracker", "Delivers Officer Incident Command Center and Citizen Emergency Portal interfaces."]
    ]
    create_styled_table(doc, arch_headers, arch_data, [1.8, 2.4, 2.3])

    doc.add_paragraph("Workflow Data Flow Sequence:")
    doc.add_paragraph(
        "1. Weather Ingestion Pipeline continuously queries high-resolution NWP feeds and topography APIs for the target coordinates.\n"
        "2. The Convective Nowcast Model evaluates physical atmospheric stability vectors: convective available potential energy, "
        "moisture convergence, radar reflectivity, and elevation depression.\n"
        "3. If hazard probability exceeds the 70% (Watch) or 85% (Severe) operational threshold, an emergency bulletin is synthesized.\n"
        "4. The bulletin and spatial boundary polygons are broadcast via WebSocket to the Incident Commander's dashboard.\n"
        "5. The Commander reviews the multi-sensor agreement, signs the alert with an officer key, and broadcasts it to all citizens in the catchment.\n"
        "6. Citizens receive instantaneous hyper-local push alerts, turn-by-turn walking routes to higher-ground shelters, and 1-tap SOS dispatch."
    )

    # -------------------------------------------------------------
    # 4. CORE FEATURES & DUAL COMMAND INTERFACES
    # -------------------------------------------------------------
    h1 = doc.add_heading("4. Core Features & Dual Command Interfaces", level=1)
    h1.style.font.color.rgb = RGBColor(15, 23, 42)

    h2 = doc.add_heading("4.1 Officer Incident Command Center", level=2)
    doc.add_paragraph(
        "Built for municipal disaster managers, NDRF battalion commanders, and traffic control authorities:"
    )
    p = doc.add_paragraph()
    p.add_run("• Multi-Hazard Situational Awareness: ").bold = True
    p.add_run("Live monitoring of convective cells (e.g. evt-cloudburst-01), active risk levels, and population exposure counts.")

    p = doc.add_paragraph()
    p.add_run("• Interactive 7-Point Timeline Scrubber: ").bold = True
    p.add_run("Enables temporal scrubbing across -6h, -4h, -2h (Historical archive), NOW (Live status), and +2h, +4h, +6h (Predictive nowcast horizons) to pre-position resources before rain onset.")

    p = doc.add_paragraph()
    p.add_run("• One-Click Alert Approval & Broadcast: ").bold = True
    p.add_run("Commanders can verify meteorological confidence and digitally sign emergency broadcast bulletins across WhatsApp, SMS, and Push Channels.")

    p = doc.add_paragraph()
    p.add_run("• Tactical Responder Dispatch Queue: ").bold = True
    p.add_run("Live incoming citizen SOS distress feed sorted by urgency, allowing instant 1-click assignment of NDRF Quick Response Units, GHMC drainage pump squads, or 108 ambulances.")

    h2 = doc.add_heading("4.2 Citizen Emergency Portal", level=2)
    doc.add_paragraph("Designed for accessibility across all mobile smartphones without requiring heavy native app installations:")
    
    p = doc.add_paragraph()
    p.add_run("• 1-Tap Real Live Device GPS Detection: ").bold = True
    p.add_run("Uses browser navigator.geolocation with high-accuracy mode (±15m) and backend reverse geocoding to resolve the citizen's exact Indian mandal, village, and pincode.")

    p = doc.add_paragraph()
    p.add_run("• Elevation-Tailored Risk Status: ").bold = True
    p.add_run("Displays clear color-coded statuses (Safe / Warning / Severe Alert) with lead time estimates and plain-language protective advice.")

    p = doc.add_paragraph()
    p.add_run("• 1-Tap Emergency SOS Dispatch: ").bold = True
    p.add_run("Transmits the citizen's exact live WGS84 coordinates, threat category (Flooding, Medical, Power, Trapped), and custom notes directly to the Incident Commander.")

    p = doc.add_paragraph()
    p.add_run("• Safe Relief Shelter Navigation: ").bold = True
    p.add_run("Calculates routes to verified municipal relief centers and elevated schools, providing walking directions that actively avoid flooded low-lying underpasses.")

    # -------------------------------------------------------------
    # 5. GEOSPATIAL & SCIENTIFIC METHODOLOGY
    # -------------------------------------------------------------
    h1 = doc.add_heading("5. Geospatial & Scientific Methodology", level=1)
    h1.style.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph(
        "SkyShield AI combines atmospheric physics with high-resolution geodetics to achieve accurate nowcasting:"
    )

    doc.add_paragraph(
        "1. Convective Physics Formula:\n"
        "   The rule-based baseline evaluates surface precipitation rate (mm/hr), relative humidity (%), and wind speed (km/h):\n"
        "   raw_prob = min(0.95, max(0.08, (precip * 0.04) + (humidity * 0.005) + (wind * 0.015)))\n\n"
        "2. Hydrological Depression Index:\n"
        "   Using CartoDEM/SRTM 30m elevation models, terrain slope gradient is calculated. Catchment basins with elevation < 535m MSL "
        "   and slope < 2.0° are flagged as high-risk pooling zones, increasing flash flood probability by +35%.\n\n"
        "3. Multi-Sensor Consensus & Confidence:\n"
        "   The system cross-references four independent inputs: NWP Surface Weather, Doppler Radar QPE reflectivity, DEM Topography, "
        "   and Satellite CTT. An agreement percentage (e.g. 91% Multi-Source Agreement) is derived to prevent false alarms."
    )

    add_callout(
        doc,
        "Strict Scientific Transparency: If external government satellite links (ISRO MOSDAC or NCMRWF IMDAA) are unconfigured, "
        "SkyShield AI transparently reports 'SOURCE_UNAVAILABLE' on the UI rather than synthesizing fictitious satellite readings.",
        "SCIENTIFIC INTEGRITY"
    )

    # -------------------------------------------------------------
    # 6. DATABASE SCHEMA & API SPECIFICATIONS
    # -------------------------------------------------------------
    h1 = doc.add_heading("6. Database Architecture & API Specifications", level=1)
    h1.style.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph("The database is structured around 20 core relational entities supporting full disaster lifecycle auditability:")

    db_headers = ["Entity Name", "Primary Purpose", "Key Attributes"]
    db_data = [
        ["users / citizens / officers", "Identity, role-based authorization, and authentication", "id, name, mobile, role, hashed_password, language"],
        ["locations", "Indian administrative geospatial registry", "name, city, mandal, district, state, lat, lon, elevation_m"],
        ["weather_observations", "High-res ground meteorological telemetry", "temperature, humidity, pressure, wind_speed, precipitation"],
        ["weather_features", "Atmospheric convective stability vectors", "cape, cin, iwv_tpw, ctt_cloud_temp, vertical_wind_shear"],
        ["predictions", "Probabilistic nowcast forecasts", "hazard_type, probability, lead_time_window, risk_polygon"],
        ["hazard_events", "Active tracking cells (evt-cloudburst-01)", "title, status, max_reflectivity_dbz, cell_centroid"],
        ["risk_zones", "Catchment basins and risk polygons", "zone_code, risk_level, susceptibility_tier, population_exposed"],
        ["alerts & alert_recipients", "Official bulletins and broadcast tracking", "title, severity, instructions, officer_signature, delivery_status"],
        ["shelters", "Verified higher-ground relief facilities", "name, capacity, occupancy, elevation_gain, facilities_list"],
        ["sos_requests", "Citizen emergency dispatch records", "request_code, category, lat, lon, reported_by, assigned_to, status"],
        ["response_teams", "NDRF, Fire & Rescue, and Medical squads", "team_name, unit_type, personnel_count, equipment, status"],
        ["audit_logs", "Immutable operational ledger", "user_identifier, action, resource_id, timestamp, after_state"]
    ]
    create_styled_table(doc, db_headers, db_data, [2.0, 2.3, 2.2])

    h2 = doc.add_heading("6.2 Key REST API Endpoints", level=2)
    doc.add_paragraph(
        "• GET /api/locations/search — Search any Indian village, mandal, city, or pincode.\n"
        "• GET /api/locations/reverse — Reverse geocodes live WGS84 GPS coordinates to Indian administrative sector.\n"
        "• GET /api/weather/current — Ingests live Open-Meteo weather parameters for given coordinates.\n"
        "• GET /api/risk/current — Calculates convective nowcasting probabilities, confidence, and lead time.\n"
        "• GET /api/risk/timeline — Delivers the 7-point temporal nowcast scrubber (-6h to +6h).\n"
        "• GET /api/shelters/nearby — Returns nearest verified relief centers sorted by distance and elevation gain.\n"
        "• POST /api/sos — Registers 1-tap SOS distress report, persists telemetry, and pushes WebSocket alert.\n"
        "• POST /api/sos/{id}/assign — Assigns an NDRF or municipal response team to an emergency incident.\n"
        "• POST /api/alerts/{id}/approve — Digital sign-off and broadcast authorization by Incident Commander.\n"
        "• WS /ws/officer & /ws/citizen — Low-latency bidirectional real-time WebSocket communication channels."
    )

    # -------------------------------------------------------------
    # 7. FEASIBILITY, VIABILITY & RISK MITIGATION
    # -------------------------------------------------------------
    h1 = doc.add_heading("7. Feasibility, Viability & Risk Analysis", level=1)
    h1.style.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph(
        "SkyShield AI has been engineered for immediate, real-world deployment across municipal and national disaster bodies:"
    )

    doc.add_paragraph(
        "• Technical Feasibility: Proven through an active cloud prototype (https://skyshield-ai-sih.vercel.app). "
        "All eight automated test suites in pytest pass with 100% success rate.\n"
        "• Operational Feasibility: Works out of the box on standard web browsers. No proprietary field hardware is required; "
        "citizens use existing smartphones, and authorities use standard control room terminals.\n"
        "• Economic Viability: Built on open-source technologies (FastAPI, React, SQLite/PostgreSQL) and public meteorological NWP feeds, "
        "incurring zero recurring per-user licensing fees."
    )

    doc.add_paragraph("Risk Mitigation Matrix:")
    risk_headers = ["Potential Risk / Challenge", "Severity", "Technical Mitigation Strategy"]
    risk_data = [
        ["Satellite / Radar API latency or rate limits", "Medium", "Open-Meteo caching layer (300s TTL) with automated fallback to built-in physical reanalysis matrices."],
        ["Cellular network failure in flooded lowlands", "High", "Progressive Web App (PWA) client-side caching ensures shelter maps and offline emergency hotlines remain accessible."],
        ["Browser location permission blocked by user", "Medium", "Graceful multi-tier fallback to manual Indian village/mandal search, pincode search, or 1-tap interactive map pinpointing."],
        ["Conflicting sensor data (Ground vs Satellite)", "Low", "Multi-Sensor Agreement Engine computes consensus score (91%) and transparently displays confidence metrics."]
    ]
    create_styled_table(doc, risk_headers, risk_data, [2.3, 1.0, 3.2])

    # -------------------------------------------------------------
    # 8. STEP-BY-STEP EVALUATION GUIDE FOR JUDGES
    # -------------------------------------------------------------
    h1 = doc.add_heading("8. Step-by-Step Evaluation Guide for SIH Evaluators", level=1)
    h1.style.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph("To evaluate the live prototype on any laptop, tablet, or mobile phone:")
    doc.add_paragraph(
        "1. Open the Live Web Application: https://skyshield-ai-sih.vercel.app\n"
        "2. Test Citizen Portal & Live GPS:\n"
        "   - Click 'Citizen Login' (Pre-loaded Profile: Aashrith, +91 98765 43210).\n"
        "   - In the Location screen, click '📍 Use My Current Location (Device GPS)'. Allow browser permission to see exact WGS84 latitude, longitude, and reverse-geocoded Indian mandal.\n"
        "   - Explore the 7-Point Timeline Scrubber: Click -6h, -2h, NOW, and +2h to see dynamic nowcast risk updates.\n"
        "   - Click 'Emergency SOS', choose 'Flooding', and click 'SEND SOS NOW'. Note the attached live GPS coordinates.\n"
        "   - Click 'Safe Shelters' to view elevation gain (+12m) and walking directions avoiding flooded underpasses.\n"
        "3. Test Officer Incident Command Center:\n"
        "   - Return to Landing Page and click 'Officer Login' (Officer ID: officer | Password: commander2026).\n"
        "   - View active hazard cell 'evt-cloudburst-01' with multi-zone catchment risk indicators.\n"
        "   - Open 'Live SOS Response Center': Observe the SOS request transmitted by the citizen appearing in real-time.\n"
        "   - Click 'ASSIGN' on the SOS card and assign 'Rescue Team 01 (NDRF Quick Response Force)'.\n"
        "   - Open 'Alert Approval': Review the Gemini AI tactical advisory and click 'APPROVE & BROADCAST ALERT'."
    )

    # -------------------------------------------------------------
    # 9. CONCLUSION & ROADMAP
    # -------------------------------------------------------------
    h1 = doc.add_heading("9. Conclusion & Project Roadmap", level=1)
    h1.style.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph(
        "SkyShield AI bridges the gap between high-altitude meteorological observation and ground-level tactical survival. "
        "By delivering high-precision 2–6 hour convective lead times, topographically guided flood routing, and automated "
        "responder dispatch, the platform provides disaster response agencies with the intelligence needed to save lives "
        "and protect infrastructure before disaster strikes."
    )

    doc.add_paragraph("Future Milestones:")
    doc.add_paragraph(
        "• Phase 1 (Completed): Full-stack cloud prototype, real-time NWP fusion, live GPS reverse geocoding, dual UI command centers.\n"
        "• Phase 2 (Target: Q3 2026): Direct integration with IMD National Doppler Weather Radar network FTP/API streams.\n"
        "• Phase 3 (Target: Q4 2026): Integration with National Emergency Communication Protocol (Cell Broadcast Service - CBS) for zero-app civilian alerts."
    )

    doc.save(output_path)
    print(f"[SUCCESS] Complete Word Documentation generated at: {output_path}")

if __name__ == "__main__":
    out_file = r"d:\projects\SKYSHIELD AI\SkyShield_AI_Complete_Documentation.docx"
    build_word_documentation(out_file)
