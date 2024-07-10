import express, { Request, Response } from "express";
import Board from "../schemas/board.schema";

export const getBoards = async (req: Request, res: Response) => {
  const userLogged = req.user;

  if (!userLogged) {
    return res.status(401).json({ message: "No hay usuario loggeado" });
  }
  try {
    const userBoards = await Board.find({ user: userLogged._id }).populate(
      "user",
      "username"
    );
    console.log(userBoards);
    if (userBoards) {
      return res.status(200).json({ userBoards });
    } else
      return res.status(404).json({ message: "No se encontraron tableros" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "error" });
    }
  }
};

export const createBoard = async (req: Request, res: Response) => {
  const userLogged = req.user;

  if (!userLogged) {
    return res.status(401).json({ message: "No hay usuario loggeado" });
  }
  try {
    const { nameBoard } = req.body;
    const newBoard = new Board({
      nameBoard,
      user: userLogged._id,
      tasks: [],
    });

    await newBoard.save();

    res
      .status(200)
      .json({ message: `tablero: ${newBoard.nameBoard} creado exitosamente` });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error });
    }
  }
};

export const editBoard = async (req: Request, res: Response) => {
  const userLogged = req.user;

  if (!userLogged) {
    return res.status(401).json({ message: "No hay usuario loggeado" });
  }

  try {
    const { newBoardName } = req.body;
    const { boardId } = req.params;

    const updateBoard = await Board.findByIdAndUpdate(boardId, {
      nameBoard: newBoardName,
    });

    res.status(200).json({ message: "board actualizado", updateBoard });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error });
    }
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  const userLogged = req.user;

  if (!userLogged) {
    return res.status(401).json({ message: "No hay usuario loggeado" });
  }
  try {
    const { boardId } = req.params;

    const boardDelete = await Board.findByIdAndDelete(boardId);

    res.status(200).json({ message: "board deleted", boardDelete });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error });
    }
  }
};