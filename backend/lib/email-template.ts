// ============================================================
// lib/email-template.ts — Template HTML email de confirmation
// ============================================================
// Ce template est utilisé par Make pour générer l'email final.
// Make remplace les variables {{variable}} avec les vraies valeurs.
//
// Pour Make — module "Compose Email" ou "HTML Template" :
// Copier le HTML et utiliser les variables Make entre {{ }}.
// ============================================================

export interface EmailTemplateData {
  prenom:           string
  nom:              string
  reference:        string
  geminiMessage:    string  // message généré par Gemini AI
  formationTitre:   string
  formationDate:    string
  formationHeure:   string
  formationLieu:    string
  formationPrix:    string
  whatsappGroupUrl: string
  socials: {
    facebook:  string
    instagram: string
    tiktok:    string
    youtube:   string
    linkedin:  string
  }
  contact: {
    email:     string
    whatsapp1: string
    whatsapp2: string
    site:      string
  }
}

/**
 * Génère le HTML complet de l'email de confirmation.
 * Peut être utilisé directement ou via Make.
 */
export function buildConfirmationEmailHtml(data: EmailTemplateData): string {
  return `<!DOCTYPE html>
<html lang="fr" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Confirmation d'inscription — CLUB AI</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

    /* Reset */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { margin: 0; padding: 0; width: 100%; }
    body {
      font-family: 'Inter', Arial, sans-serif;
      background-color: #F8FAFC;
      color: #0F172A;
      -webkit-font-smoothing: antialiased;
    }
    img { border: 0; display: block; }
    a { text-decoration: none; }
    table { border-spacing: 0; border-collapse: collapse; }

    /* Responsive */
    @media only screen and (max-width: 600px) {
      .container     { width: 100% !important; }
      .content-pad   { padding: 24px 20px !important; }
      .hero-title    { font-size: 22px !important; }
      .recap-grid    { display: block !important; }
      .recap-col     { width: 100% !important; display: block !important; margin-bottom: 12px !important; }
      .social-btn    { margin: 4px !important; }
      .cta-btn       { font-size: 14px !important; padding: 14px 24px !important; }
    }
  </style>
</head>
<body>

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
         style="background-color:#F8FAFC; padding: 32px 16px;">
    <tr>
      <td align="center">

        <!-- Container 600px -->
        <table class="container" width="600" cellpadding="0" cellspacing="0" role="presentation"
               style="max-width:600px; width:100%; border-radius:16px; overflow:hidden; box-shadow:0 4px 32px rgba(15,23,42,0.10);">

          <!-- ══════════════════════════════════════════ -->
          <!-- HEADER -->
          <!-- ══════════════════════════════════════════ -->
          <tr>
            <td style="background-color:#0F172A; padding:32px 40px; text-align:center; position:relative;">

              <!-- Nom CLUB AI avec lettres colorées -->
              <div style="font-family:'Montserrat',Arial,sans-serif; font-size:28px; font-weight:800; letter-spacing:-0.02em; line-height:1; margin-bottom:6px;">
                <span style="color:#16A34A;">J</span><span style="color:#7C3AED;">O</span><span style="color:#16A34A;">V</span><span style="color:#7C3AED;">I</span><span style="color:#16A34A;">M</span>&nbsp;<span style="color:#7C3AED;">T</span><span style="color:#16A34A;">e</span><span style="color:#7C3AED;">c</span><span style="color:#16A34A;">h</span>
              </div>
              <div style="font-family:'Inter',Arial,sans-serif; font-size:10px; color:rgba(255,255,255,0.35); letter-spacing:0.15em; text-transform:uppercase; margin-bottom:24px;">
                Bujumbura, Burundi
              </div>

              <!-- Icône confirmation -->
              <div style="width:56px; height:56px; background:rgba(245,158,11,0.12); border:2px solid rgba(245,158,11,0.25); border-radius:14px; margin:0 auto 16px; display:flex; align-items:center; justify-content:center;">
                <div style="font-size:26px; line-height:1;">✓</div>
              </div>

              <div style="font-family:'Inter',Arial,sans-serif; font-size:10px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#F59E0B; margin-bottom:10px;">
                Inscription confirmée
              </div>

              <h1 class="hero-title" style="font-family:'Montserrat',Arial,sans-serif; font-size:26px; font-weight:700; color:#FFFFFF; line-height:1.2; letter-spacing:-0.01em;">
                Votre inscription est confirmée
              </h1>

              <!-- Ligne dorée -->
              <div style="width:40px; height:3px; background:#F59E0B; border-radius:999px; margin:16px auto 0;"></div>
            </td>
          </tr>

          <!-- ══════════════════════════════════════════ -->
          <!-- CORPS -->
          <!-- ══════════════════════════════════════════ -->
          <tr>
            <td class="content-pad" style="background-color:#FFFFFF; padding:40px;">

              <!-- Salutation -->
              <p style="font-family:'Montserrat',Arial,sans-serif; font-size:18px; font-weight:700; color:#0F172A; margin-bottom:6px;">
                Bonjour ${data.prenom} ${data.nom},
              </p>
              <div style="width:32px; height:2px; background:#F59E0B; border-radius:999px; margin-bottom:20px;"></div>

              <!-- Message Gemini AI -->
              <div style="font-family:'Inter',Arial,sans-serif; font-size:15px; line-height:1.75; color:#475569; background:#F8FAFC; border-left:3px solid #F59E0B; padding:20px 20px 20px 20px; border-radius:0 10px 10px 0; margin-bottom:28px;">
                ${data.geminiMessage.replace(/\n/g, '<br>')}
              </div>

              <!-- Référence -->
              <div style="background:#0F172A; border-radius:12px; padding:18px 24px; text-align:center; margin-bottom:28px;">
                <div style="font-family:'Inter',Arial,sans-serif; font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.4); margin-bottom:6px;">
                  Votre référence d'inscription
                </div>
                <div style="font-family:'Montserrat',Arial,sans-serif; font-size:22px; font-weight:800; color:#F59E0B; letter-spacing:0.08em;">
                  ${data.reference}
                </div>
                <div style="font-family:'Inter',Arial,sans-serif; font-size:11px; color:rgba(255,255,255,0.3); margin-top:6px;">
                  Conservez cette référence pour tout suivi
                </div>
              </div>

              <!-- Récapitulatif formation -->
              <div style="margin-bottom:28px;">
                <div style="font-family:'Inter',Arial,sans-serif; font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(15,23,42,0.4); margin-bottom:14px;">
                  Détails de votre formation
                </div>

                <!-- Titre formation -->
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:14px 16px; margin-bottom:8px; display:flex; align-items:center; gap:10px;">
                  <span style="font-size:16px;">🎓</span>
                  <div>
                    <div style="font-family:'Inter',Arial,sans-serif; font-size:10px; color:rgba(15,23,42,0.4); font-weight:600; text-transform:uppercase; letter-spacing:0.08em;">Formation</div>
                    <div style="font-family:'Montserrat',Arial,sans-serif; font-size:13px; font-weight:700; color:#0F172A;">${data.formationTitre}</div>
                  </div>
                </div>

                <!-- Grille infos -->
                <table class="recap-grid" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="recap-col" width="50%" style="padding-right:4px; padding-bottom:8px; vertical-align:top;">
                      <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:12px 14px;">
                        <div style="font-family:'Inter',Arial,sans-serif; font-size:10px; color:rgba(15,23,42,0.4); font-weight:600; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px;">📅 Date</div>
                        <div style="font-family:'Montserrat',Arial,sans-serif; font-size:13px; font-weight:600; color:#0F172A;">${data.formationDate}</div>
                      </div>
                    </td>
                    <td class="recap-col" width="50%" style="padding-left:4px; padding-bottom:8px; vertical-align:top;">
                      <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:12px 14px;">
                        <div style="font-family:'Inter',Arial,sans-serif; font-size:10px; color:rgba(15,23,42,0.4); font-weight:600; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px;">⏰ Horaire</div>
                        <div style="font-family:'Montserrat',Arial,sans-serif; font-size:13px; font-weight:600; color:#0F172A;">${data.formationHeure}</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="recap-col" width="50%" style="padding-right:4px; padding-bottom:8px; vertical-align:top;">
                      <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:12px 14px;">
                        <div style="font-family:'Inter',Arial,sans-serif; font-size:10px; color:rgba(15,23,42,0.4); font-weight:600; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px;">📍 Lieu</div>
                        <div style="font-family:'Montserrat',Arial,sans-serif; font-size:13px; font-weight:600; color:#0F172A;">${data.formationLieu}</div>
                      </div>
                    </td>
                    <td class="recap-col" width="50%" style="padding-left:4px; padding-bottom:8px; vertical-align:top;">
                      <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:12px 14px;">
                        <div style="font-family:'Inter',Arial,sans-serif; font-size:10px; color:rgba(15,23,42,0.4); font-weight:600; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px;">💰 Prix</div>
                        <div style="font-family:'Montserrat',Arial,sans-serif; font-size:13px; font-weight:700; color:#F59E0B;">${data.formationPrix}</div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Bouton WhatsApp groupe -->
              <div style="text-align:center; margin-bottom:32px;">
                <div style="font-family:'Inter',Arial,sans-serif; font-size:12px; color:#475569; margin-bottom:12px;">
                  Rejoignez le groupe WhatsApp de votre formation pour recevoir toutes les informations importantes.
                </div>
                <a href="${data.whatsappGroupUrl}" class="cta-btn"
                   style="display:inline-block; background:#25D366; color:#FFFFFF; font-family:'Montserrat',Arial,sans-serif; font-size:15px; font-weight:700; padding:16px 32px; border-radius:12px; text-decoration:none; letter-spacing:0.01em;">
                  💬 &nbsp;Rejoindre le groupe WhatsApp
                </a>
              </div>

              <!-- Séparateur -->
              <div style="border-top:1px solid #E2E8F0; margin-bottom:24px;"></div>

              <!-- Réseaux sociaux -->
              <div style="text-align:center; margin-bottom:16px;">
                <div style="font-family:'Inter',Arial,sans-serif; font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(15,23,42,0.4); margin-bottom:14px;">
                  Suivez-nous
                </div>
                <div>
                  <!-- Facebook — bleu officiel #1877F2 -->
                  <a href="${data.socials.facebook}" class="social-btn"
                     style="display:inline-block; background:#1877F2; color:#fff; font-family:'Inter',Arial,sans-serif; font-size:11px; font-weight:700; padding:9px 14px; border-radius:8px; text-decoration:none; margin:3px; letter-spacing:0.01em;">
                    <span style="margin-right:5px;">f</span>Facebook
                  </a>
                  <!-- Instagram — dégradé officiel -->
                  <a href="${data.socials.instagram}" class="social-btn"
                     style="display:inline-block; background:linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); color:#fff; font-family:'Inter',Arial,sans-serif; font-size:11px; font-weight:700; padding:9px 14px; border-radius:8px; text-decoration:none; margin:3px;">
                    📷 Instagram
                  </a>
                  <!-- TikTok — noir officiel avec accent -->
                  <a href="${data.socials.tiktok}" class="social-btn"
                     style="display:inline-block; background:#010101; color:#fff; font-family:'Inter',Arial,sans-serif; font-size:11px; font-weight:700; padding:9px 14px; border-radius:8px; text-decoration:none; margin:3px; border:1px solid #333;">
                    <span style="color:#69C9D0;">♪</span> TikTok
                  </a>
                  <!-- YouTube — rouge officiel #FF0000 -->
                  <a href="${data.socials.youtube}" class="social-btn"
                     style="display:inline-block; background:#FF0000; color:#fff; font-family:'Inter',Arial,sans-serif; font-size:11px; font-weight:700; padding:9px 14px; border-radius:8px; text-decoration:none; margin:3px;">
                    ▶ YouTube
                  </a>
                </div>
              </div>

            </td>
          </tr>

          <!-- ══════════════════════════════════════════ -->
          <!-- FOOTER -->
          <!-- ══════════════════════════════════════════ -->
          <tr>
            <td style="background-color:#0F172A; padding:28px 40px; text-align:center;">

              <!-- Nom coloré -->
              <div style="font-family:'Montserrat',Arial,sans-serif; font-size:16px; font-weight:800; margin-bottom:4px;">
                <span style="color:#16A34A;">J</span><span style="color:#7C3AED;">O</span><span style="color:#16A34A;">V</span><span style="color:#7C3AED;">I</span><span style="color:#16A34A;">M</span>&nbsp;<span style="color:#7C3AED;">T</span><span style="color:#16A34A;">e</span><span style="color:#7C3AED;">c</span><span style="color:#16A34A;">h</span>
              </div>
              <div style="font-family:'Inter',Arial,sans-serif; font-size:10px; color:rgba(255,255,255,0.3); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:16px;">
                Bujumbura, Burundi
              </div>

              <!-- Contacts -->
              <div style="margin-bottom:12px;">
                <a href="mailto:${data.contact.email}"
                   style="font-family:'Inter',Arial,sans-serif; font-size:12px; color:rgba(255,255,255,0.5); text-decoration:none; display:block; margin-bottom:4px;">
                  ✉ ${data.contact.email}
                </a>
                <a href="https://wa.me/${data.contact.whatsapp1.replace(/\s+/g,'').replace('+','')}"
                   style="font-family:'Inter',Arial,sans-serif; font-size:12px; color:rgba(255,255,255,0.5); text-decoration:none; display:block; margin-bottom:2px;">
                  💬 ${data.contact.whatsapp1}
                </a>
                <a href="https://wa.me/${data.contact.whatsapp2.replace(/\s+/g,'').replace('+','')}"
                   style="font-family:'Inter',Arial,sans-serif; font-size:12px; color:rgba(255,255,255,0.5); text-decoration:none; display:block;">
                  💬 ${data.contact.whatsapp2}
                </a>
              </div>

              <!-- Copyright -->
              <div style="font-family:'Inter',Arial,sans-serif; font-size:11px; color:rgba(255,255,255,0.2); border-top:1px solid rgba(255,255,255,0.06); padding-top:14px; margin-top:14px;">
                © ${new Date().getFullYear()} CLUB AI · Tous droits réservés<br>
                Cet email vous a été envoyé suite à votre inscription.
              </div>
            </td>
          </tr>

        </table>
        <!-- /Container -->

      </td>
    </tr>
  </table>
  <!-- /Wrapper -->

</body>
</html>`
}

/**
 * Génère le sujet de l'email.
 */
export function buildEmailSubject(prenom: string, formationTitre: string): string {
  const court = formationTitre.length > 40
    ? formationTitre.substring(0, 40) + '…'
    : formationTitre
  return `✅ ${prenom}, votre inscription à "${court}" est confirmée — CLUB AI`
}
