import React from "react";

type Article = {
  title: string;
  category: string;
  image: string;
};

const FeaturedNewsSection: React.FC = () => {
  const articles: Article[] = [
    {
      title: "Ieškomas patyręs santechnikas daugiabučių namų renovacijos projektui",
      category: "Darbas",
      image: "/img/work_post_truncated.jpg",
    },
    {
      title: "Parduodamas erdvus garažas su elektros įvadu strategiškai patogioje Kauno vietoje",
      category: "Nekilnojamasis turtas",
      image: "/img/parduodamas-garazas.jpg",
    },
    {
      title: "Nuomojamas jaukus 2 kambarių butas su balkonu ir parkingu miesto centre",
      category: "Nuoma",
      image: "/img/butai.jpg",
    },
  ];

  return (
    <section className="container my-0">
      <div className="row">
        <div className="col-md-6  d-flex flex-column gap-3">
          <div className="card mb-4 shadow-sm h-100">
            <img src={articles[0].image} className="card-img-top" alt={articles[0].title} />
            <div className="card-body">
              <h5 className="card-title">{articles[0].title}</h5>
              <p className="card-text text-muted">{articles[0].category}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 d-flex flex-column gap-3">
          {articles.slice(1).map((a, i) => (
            <div key={i} className="card h-100 shadow-sm">
              <div className="row g-0">
                <div className="col-md-6 d-flex justify-content-center align-items-center text-center">
                  <img src={a.image} className="img-fluid rounded-start" alt={a.title} />
                </div>
                <div className="col-md-6 p-3 d-flex flex-column justify-content-center">
                  <h6 className="mb-1">{a.title}</h6>
                  <small className="text-muted">{a.category}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedNewsSection;