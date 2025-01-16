import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HealthNewsImages.css'; // Import the CSS file

function HealthNewsImages() {
    const [articles, setArticles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const defaultImage = 'https://via.placeholder.com/300x150?text=No+Image+Available'; // Default placeholder image

    useEffect(() => {
        const fetchNewsImages = async () => {
            try {
                const response = await axios.get('https://newsdata.io/api/1/latest', {
                    params: {
                        apikey: 'pub_65520b93e12fab4823eb6b7ec2b5f7a29e8e4',
                        category: 'health',
                        country: 'in',
                        language: 'en',
                    },
                });
                const filteredArticles = response.data.results.filter(article => article.image_url);
                setArticles(filteredArticles);
            } catch (error) {
                console.error('Error fetching health news images:', error);
            }
        };

        fetchNewsImages();
    }, []);

    const handleNextClick = () => {
        if (currentIndex + 3 < articles.length) {
            setCurrentIndex(currentIndex + 3);
        }
    };

    const handlePreviousClick = () => {
        if (currentIndex - 3 >= 0) {
            setCurrentIndex(currentIndex - 3);
        }
    };

    const currentArticles = articles.slice(currentIndex, currentIndex + 3);

    return (
        <div>
            <h2>Health News</h2>
            <div className="news-container">
                {currentArticles.length > 0 ? (
                    currentArticles.map((article, index) => (
                        <div key={index} className="news-item">
                            <img
                                src={article.image_url}
                                alt={`Health News ${index + 1}`}
                                onError={(e) => {
                                    e.target.onerror = null; // Prevent infinite loop in case the default image fails
                                    e.target.src = defaultImage;
                                }}
                            />
                            <p className="carousel-title">{article.title}</p>
                            <a
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="carousel-link"
                            >
                                Read More
                            </a>
                        </div>
                    ))
                ) : (
                    <p>No health news available with images.</p>
                )}

{currentIndex > 0 && (
    <button onClick={handlePreviousClick} className="prev-arrow">
        <i className="fas fa-chevron-left"></i> {/* Font Awesome left arrow */}
    </button>
)}
{currentIndex + 3 < articles.length && (
    <button onClick={handleNextClick} className="next-arrow">
        <i className="fas fa-chevron-right"></i> {/* Font Awesome right arrow */}
    </button>
)}

            </div>
        </div>
    );
}

export default HealthNewsImages;
