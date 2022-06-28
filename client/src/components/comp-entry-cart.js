import React, { useState, useEffect, useRef } from "react";
import './../styles/comp-entry-cart.scss';
import * as u from '../scripts/utils'; 

export default function Product(props) {
  const [componentName] = useState('entry-cart');
  const [componentClass] = useState('component '+componentName+' '+(props.data['isFocus']?u.ACTIVECLASS:''));
  
  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getIcon = (title,cssClass='',click=(()=>{})) => 
    <span className={"material-icons icon "+cssClass} onClick={click}>{title}</span>;

  const getComponent = () => {
    let componentData = props.data['componentData'];
    let requiredData = [componentData];
    let handleCartChange = props.events['handleCartChange'];
    if(!u.isRequiredDataValid(requiredData)) return null;

    let data = componentData['data'];
    let metadata = componentData['metadata'];
    let componentId = metadata['id'];
    let quantity = props.data['cartData'][componentId]['quantity'];

    let titleText = 
      <h3 className="title">{data['name']}</h3>;

    let categoryText = 
      <p className="category secondary">{data['category']}</p>;

    let imageContainer = 
      <div className="image-container"> 
        <img src={data['image']} alt='product'/>
      </div>;

    let imageOverlay = 
      <div className="image-overlay"></div>;

    let reviewContainer = 
      <div className="reviews">
        <p>{u.shortenNum(data['rating'])}</p>
        <p className="review-count">({data['rating_count']})</p>
        <div className="star-container">
          {[...Array(parseInt(data['rating']))].map((_, i) => <div key={i} className="star full"></div>)}
          {(data['rating']%1 > 0.3? <div className="star full partial"></div>:null)}
        </div>
      </div>;

    let cartActionContainer = 
      <div className="item-action-container">
        <div className="item-action-section">
          {getIcon('remove','item-action-icon minus',()=>handleCartChange(componentData,-1))} 
          <h4>{quantity}</h4> 
          {getIcon('add','item-action-icon plus',()=>handleCartChange(componentData,1))}
        </div>
        <div className="item-action-section">
          <h4 className="price">{u.formatPrice(parseInt(quantity) * data['price'])}</h4> 
        </div>     
      </div>;

    let textContainer = 
      <div className="text-container">
        <div className="text-container-inner">
          {titleText}
          {categoryText}
          {reviewContainer}
        </div>
      </div>;

    let componentContent = 
      <>
        {imageContainer}
        {imageOverlay}
        {textContainer}
        {cartActionContainer}
      </>;

    let component = 
      <div className={componentClass}>
        <div className="component-wrapper">
          <div className="component-content">
            {componentContent}
          </div>
        </div>
      </div>;

    return component;
  };

  return getComponent();
}