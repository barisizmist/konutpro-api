// Projects Controller
import { sql } from '../config/db.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await sql`SELECT * FROM projects ORDER BY updated_at DESC`;
    // Map database columns to payload property names
    const mappedProjects = projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      developer: project.developer,
      city: project.city,
      district: project.district,
      priceMin: project.price_min,
      priceMax: project.price_max,
      totalUnits: project.total_units,
      availableUnits: project.available_units,
      completionDate: project.completion_date,
      image: project.image,
      features: project.features,
      created_at: project.created_at
    }));
    res.status(200).json(mappedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProjectById = async (req, res) => {
  const projectId = req.params.id;
  try {
    const project = await sql`SELECT * FROM projects WHERE id = ${projectId}`;
    if (project.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    // Map database columns to payload property names
    const mappedProject = {
      id: project[0].id,
      name: project[0].name,
      description: project[0].description,
      status: project[0].status,
      developer: project[0].developer,
      city: project[0].city,
      district: project[0].district,
      priceMin: project[0].price_min,
      priceMax: project[0].price_max,
      totalUnits: project[0].total_units,
      availableUnits: project[0].available_units,
      completionDate: project[0].completion_date,
      image: project[0].image,
      features: project[0].features,
      created_at: project[0].created_at
    };
    res.status(200).json(mappedProject);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProject = async (req, res) => {
  const { name, description, status, developer, city, district, priceMin, priceMax, totalUnits, availableUnits, completionDate, image, features } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  try {
    const projectStatus = status || 'active';
    await sql`
      INSERT INTO projects (
        name,
        description,
        status,
        developer,
        city,
        district,
        price_min,
        price_max,
        total_units,
        available_units,
        completion_date,
        image,
        features
      )
      VALUES (
        ${name},
        ${description},
        ${projectStatus},
        ${developer},
        ${city},
        ${district},
        ${priceMin},
        ${priceMax},
        ${totalUnits},
        ${availableUnits},
        ${completionDate},
        ${image},
        ${features}
      )
    `;
    res.status(201).json({ message: 'Project created successfully' });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: error.detail || 'Internal server error' });
  }
};

export const updateProject = async (req, res) => {
  const projectId = req.params.id;
  const { name, description, status, developer, city, district, priceMin, priceMax, totalUnits, availableUnits, completionDate, image, features } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  try {
    await sql`
      UPDATE projects
      SET
        name = ${name},
        description = ${description},
        status = ${status},
        developer = ${developer},
        city = ${city},
        district = ${district},
        price_min = ${priceMin},
        price_max = ${priceMax},
        total_units = ${totalUnits},
        available_units = ${availableUnits},
        completion_date = ${completionDate},
        image = ${image},
        features = ${features},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId}
    `;
    res.status(200).json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProject = async (req, res) => {
  const projectId = req.params.id;
  try {
    if (isNaN(parseInt(projectId))) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }
    const result = await sql`DELETE FROM projects WHERE id = ${projectId} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
