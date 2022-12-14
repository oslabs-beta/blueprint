import React, { useState, useEffect } from "react";
import Tree from 'react-d3-tree';
import styles from '../stylesheets/_tree3.scss';

const Tree3 = ({ rootNode }) => {
  console.log('inside Tree3');

  const [treeObj, setTreeObj] = useState({});
  const treeArr = [];

  let parent = {
    name: rootNode.name || 'root node',
    // type: rootNode.type || 'dummyType',
    attributes: {
      type: rootNode.elementType,
    },
    children: []
  };
  treeArr.push(parent);
  // setTreeArr([...treeArr, parent]);

  useEffect(() => {
    console.log('treeArr --> ', treeArr);
  }, []);

  // track + perform work on fiber node
  const performUnitOfWork = (fiber, parent) => {
    console.log('inside performUnitOfWork');
    // wrap tempObj in conditional to determine if type is meaningful (i.e. a function)
    // console.log(fiber.type.prototype.prototype.isReactComponent);
    let tempObj;
    console.log('is tempObj defined --> ', tempObj);

    // if (fiber.elementType !== null || typeof fiber.elementType === 'string') {
    if (fiber.elementType !== null) {
    // if (fiber.type.prototype.prototype.isReactComponent) {
      tempObj = {
        name: fiber.name || '',
        // type: fiber.type || 'dummyType',
        attributes: {
          type: fiber.elementType
        },
        children: []
      };
      console.log('tempObj --> ', tempObj);
      parent.push(tempObj);
    }

    // alternative to pushing tempObj onto treeArr - setTreeArr, set state 
    // setTreeArr([...treeArr, parent.push(tempObj)]);

    if (fiber.child) {
      // console.log('child -->', fiber.child);
      if (tempObj !== undefined) parent = parent[0].children; // move to next child if tempObj is defined
      let child = fiber.child;
      return { child, parent }; // return fiber.child + new parent obj
    }
    while (fiber) {
      if (fiber.sibling) {
        // console.log('sibling --> ', fiber.sibling)
        let sibling = fiber.sibling;
        return { sibling, parent };
      }
      // console.log('inside performUnitOfWork - fiber.return')
      fiber = fiber.return;
    }
    return;
  }
  // traverse component tree
  const traverse = (nextNode, parent = treeArr[0].children) => {
    console.log('inside traverse');
    
    while (nextNode) {
      // console.log('next --> ', nextNode);
      const output = performUnitOfWork(nextNode, parent);
      // console.log('inside nextNode -->', output);
      if (!output) {
        console.log('End of traversal')
        setTreeObj(Object.assign({}, treeArr[0]));
        // console.log('treeArr --> ', treeArr[0]);
        break;
      }
      // nextNode = output.child || output.sibling;
      if (output.child) {
        // console.log('next node is child');
        nextNode = output.child;
      } else if (output.sibling) {
        // console.log('next node is sibling');
        nextNode = output.sibling;
      }
      parent = output.parent;
    }
  }

  useEffect(() => {
    traverse(rootNode.child);
  }, []);

  // useEffect(() => {
  //   console.log('treeObj --> ', treeObj);
  // }, [treeObj]);

  return (
      <div id="treeWrapper" style={{ width: '50em', height: '20em' }}>
      <Tree data={treeObj} />
    </div>        
  )
};

export default Tree3;