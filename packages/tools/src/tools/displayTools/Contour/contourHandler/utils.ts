import type { Types } from '@cornerstonejs/core';
import { Enums } from '@cornerstonejs/core';
import vtkCellArray from '@kitware/vtk.js/Common/Core/CellArray';
import vtkPoints from '@kitware/vtk.js/Common/Core/Points';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';

/**
 * takes a geometry object as an argument
 * and throws an error if the geometry object is not a contour
 * @param geometry -  The geometry object to be rendered.
 */
export function validateGeometry(geometry: Types.IGeometry): void {
  if (!geometry) {
    throw new Error(`No contours found for geometryId ${geometry.id}`);
  }

  const geometryId = geometry.id;

  if (geometry.type !== Enums.GeometryType.CONTOUR) {
    throw new Error(
      `Geometry type ${geometry.type} not supported for rendering.`
    );
  }

  if (!geometry.data) {
    console.warn(
      `No contours found for geometryId ${geometryId}. Skipping render.`
    );
    return;
  }
}

/**
 * It takes a contourSet and returns a vtkPolyData for that contourSet. A contour set
 * is a collection of contours. Each contour is a collection of points. Each point
 * is x,y,z in the world coordinate system.
 *
 * @param contourSet -  the contour set that you want to convert to polyData
 * @returns A vtkPolyData object
 */
export function getPolyData(contourSet: Types.IContourSet) {
  const pointArray = [];

  const points = vtkPoints.newInstance();
  const lines = vtkCellArray.newInstance();

  // this variable will indicate the index of the first point in the current line
  // so we can correctly generate the point index list to add in the cellArray
  let pointIndex = 0;
  contourSet.contours.forEach((contour: Types.IContour) => {
    const pointList = contour.points;
    const flatPoints = contour.flatPointsArray;
    const type = contour.type;

    // creating a point index list that defines a line
    const pointIndexes = pointList.map(
      (_, pointListIndex) => pointListIndex + pointIndex
    );

    // if close planar, add the first point index to the list
    if (type === Enums.ContourType.CLOSED_PLANAR) {
      pointIndexes.push(pointIndexes[0]);
    }

    const linePoints = Float32Array.from(flatPoints);
    // add the current points into the point list
    pointArray.push(...linePoints);
    // add the point indexes into the cell array
    lines.insertNextCell([...pointIndexes]);
    // update the first point index
    pointIndex = pointIndex + pointList.length;
  });

  // converts the pointArray into vtkPoints
  points.setData(pointArray, 3);

  // creates the polyData
  const polygon = vtkPolyData.newInstance();
  polygon.setPoints(points);
  polygon.setLines(lines);

  return polygon;
}
