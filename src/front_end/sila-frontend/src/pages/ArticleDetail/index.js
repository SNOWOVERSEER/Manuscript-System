import React from 'react';
import { useParams } from 'react-router-dom';

const ArticleDetail = () => {
    const { id } = useParams(); // Get the article id from URL parameters

    // Fetch article details based on `id`, here we use a placeholder
    return (
        <div>
            <h1>Article Details - ID: {id}</h1>
            {/* Display article details here */}
        </div>
    );
};

export default ArticleDetail;
