import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import HexMap from 'components/hex-map';
import FlexContainer from 'primitives/container/flex-container';
import Header, { HeaderType } from 'primitives/text/header';

import Entities from 'constants/entities';

import './style.css';
import '../style.css';

const renderEntity = (entityId, entityType, entity) => {
  const conf = Entities[entityType];

  const blockAttributes = [];
  if (entity.tags) {
    blockAttributes.push(
      <div key="tags">
        <b>Tags: </b>
        {entity.tags}
      </div>,
    );
  }
  if ((conf.attributes || []).length) {
    conf.attributes.filter(({ key }) => entity[key]).forEach(({ key, name }) =>
      blockAttributes.push(
        <div key={key}>
          <b>{name}: </b>
          {entity[key]}
        </div>,
      ),
    );
  }
  if (entity.neighbors) {
    blockAttributes.push(
      <div key="neighbors">
        <b>Neighbors: </b>
        {entity.neighbors}
      </div>,
    );
  }
  if (entity.children) {
    blockAttributes.push(
      <div key="children">
        <b>Children: </b>
        {entity.children}
      </div>,
    );
  }
  if (entity.description) {
    blockAttributes.push(
      <div key="description">
        <b>Description: </b>
        {entity.description}
      </div>,
    );
  }
  let attrBlock = null;
  if (blockAttributes.length) {
    attrBlock = (
      <FlexContainer justify="flexEnd">
        <FlexContainer className="ExpandedPrintable-Block" direction="column">
          {blockAttributes}
        </FlexContainer>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer
      key={entityId}
      direction="column"
      className="ExpandedPrintable-Entity"
    >
      <FlexContainer align="baseline" className="ExpandedPrintable-Header">
        <Header type={HeaderType.header2} dark>
          {entity.name}
        </Header>
        <Header
          type={HeaderType.header4}
          dark
          className="ExpandedPrintable-Type"
        >
          ({conf.name}
          {entity.location ? ` - ${entity.location}` : ''})
        </Header>
      </FlexContainer>
      {attrBlock}
    </FlexContainer>
  );
};

const renderEntities = entities =>
  map(entities, (entityList, entityType) =>
    map(entityList, (entity, entityId) =>
      renderEntity(entityId, entityType, entity),
    ),
  );

export default function ExpandedPrintable({ printable, entities }) {
  return (
    <div className="Printable">
      <div className="Printable-Container">
        <HexMap hexes={printable.hexes} viewbox={printable.viewbox} />
      </div>
      <div className="Printable-EntityContainer">
        {renderEntities(entities)}
      </div>
    </div>
  );
}

ExpandedPrintable.propTypes = {
  entities: PropTypes.shape().isRequired,
  printable: PropTypes.shape({
    hexes: PropTypes.arrayOf(PropTypes.object).isRequired,
    viewbox: PropTypes.string.isRequired,
  }).isRequired,
};