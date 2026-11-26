/* ------------------------------------------------------------------
   Papers, talks and the email address live in this one file.

   To add a paper: copy one { ... } block in "papers", paste it at the
   top of the list, and change the text. Newest first.

   To add a talk: do the same in "talks".

   On GitHub: open this file, click the pencil, edit, then press
   "Commit changes". The site updates a minute or two later.
   ------------------------------------------------------------------ */

window.SITE = {

  // The name and the domain are kept apart, and the address is only put
  // together in the visitor's browser, so that spam bots reading the page
  // source do not find a whole address.
  email: ["anna.zanoli", "ista.ac.at"],

  papers: [
    {
      title: "99.99% of cubic surfaces have a rational point",
      coauthors: "Tim Browning",
      venue: "Preprint",
      year: 2026,
      arxiv: "2611.33932"
    },
    {
      title: "Average density of rational points on quartic surfaces",
      coauthors: "",                 // for example "Ada Lovelace" or "A. Lovelace and E. Noether"; leave "" if you are the only author
      venue: "Preprint",             // journal name once it is published
      year: 2026,
      arxiv: "2611.32640"
    },
    {
      title: "Counting <i>D</i><sub>4</sub>-field extensions by multi-invariants",
      coauthors: "Willem Hansen",
      venue: "Preprint",
      year: 2025,
      arxiv: "2507.12342"
    }
  ],

  // For each talk: title and date, then where it was. "event" is the seminar
  // or conference, "place" the institute or town. The lines ending in "Link"
  // are optional web addresses; "note" is an optional extra name.
  talks: [
    {
      title: "Random quartic surfaces",
      date: "November 2026",
      event: "Number theory seminar",
      eventLink: "https://number-theory.ista.ac.at/",
      place: "ISTA"
    },
    {
      title: "Average density of rational points on quartic surfaces",
      date: "September 2026",
      event: "Analytic methods for rational points on varieties",
      place: "Strobl am Wolfgangsee"
    },
    {
      title: "The Plücker quartic",
      date: "December 2025",
      event: "Number theory seminar",
      eventLink: "https://number-theory.ista.ac.at/",
      place: "ISTA"
    },
    {
      title: "Counting <i>D</i><sub>4</sub>-field extensions by multi-invariants",
      date: "December 2025",
      event: "Rencontres de théorie analytique des nombres",
      eventLink: "https://indico.math.cnrs.fr/category/578/",
      note: "Rencontres Daboussi",
      noteLink: "https://webusers.imj-prg.fr/~cathy.swaenepoel/RTAEN/rtaen.html",
      place: "Institut Henri Poincaré, Paris",
      placeLink: "https://www.ihp.fr/"
    },
    {
      title: "Towards a conjecture of Gundlach",
      date: "April 2025",
      event: "Number theory seminar",
      eventLink: "https://number-theory.ista.ac.at/",
      place: "ISTA"
    },
    {
      title: "On a paper of Wang about K3 surfaces of degree (2,2,2)",
      date: "January 2025",
      event: "Number theory seminar",
      eventLink: "https://number-theory.ista.ac.at/",
      place: "ISTA"
    },
    {
      title: "Counting integer points on Markoff type surfaces",
      date: "October 2024",
      event: "Number theory seminar",
      eventLink: "https://number-theory.ista.ac.at/",
      place: "ISTA"
    }
  ]

};
