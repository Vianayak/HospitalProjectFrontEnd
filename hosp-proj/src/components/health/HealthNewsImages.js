import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HealthNewsImages.css'; // Import the CSS file

function HealthNewsImages() {
    const [articles, setArticles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // Track the current set of articles to show

    useEffect(() => {
        const fetchNewsImages = async () => {
            try {
                const response = await axios.get('https://newsdata.io/api/1/latest', {
                    params: {
                        apikey: 'pub_65520b93e12fab4823eb6b7ec2b5f7a29e8e4',
                        category: 'health',
                        country: 'in',
                        language: 'en', // For India-specific news
                    }
                });
                // Filter out articles that do not have an image
                const filteredArticles = response.data.results.filter(article => article.image_url);
                setArticles(filteredArticles);
            } catch (error) {
                console.error('Error fetching health news images:', error);
            }
        };

        fetchNewsImages();
    }, []);

    // Function to handle clicking on the next small arrow
    const handleNextClick = () => {
        if (currentIndex + 2 < articles.length) {
            setCurrentIndex(currentIndex + 2); // Show the next 2 articles
        }
    };

    // Function to handle clicking on the previous small arrow
    const handlePreviousClick = () => {
        if (currentIndex - 2 >= 0) {
            setCurrentIndex(currentIndex - 2); // Show the previous 2 articles
        }
    };

    // Get the current set of 2 articles
    const currentArticles = articles.slice(currentIndex, currentIndex + 2);

    return (
        <div>
            <h2>Health News</h2>
            <div className="news-container">
                {currentArticles.length > 0 ? (
                    currentArticles.map((article, index) => (
                        <div key={index} className="news-item">
                            {/* Show the image */}
                            <img 
                                src={article.image_url} 
                                alt={`Health News ${index + 1}`} 
                            />
                            {/* Show the title and link */}
                            <p className="carousel-title">{article.title}</p>
                            <a 
                                href={article.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="carousel-link"
                            >
                                Read More
                            </a>
                            
                            {/* Show the small right arrow only on the second item */}
                            {index === 1 && (
                                <button 
                                    onClick={handleNextClick} 
                                    className="next-arrow"
                                >
                                    &#8594; {/* Right arrow symbol */}
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No health news available with images.</p>
                )}
                
                {/* Previous Arrow (show before the first item if there are previous articles) */}
                {currentIndex > 0 && (
                    <button 
                        onClick={handlePreviousClick} 
                        className="prev-arrow"
                    >
                        &#8592; {/* Left arrow symbol */}
                    </button>
                )}
            </div>
        </div>
    );
}

export default HealthNewsImages;
