import { Controller, Param, Put, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../guards/roles.decorator";

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {

  constructor(private readonly adminService: AdminService) { }

  @Roles('Admin')
  @Put('/users/:userId/banstatus')
  async banUsers(@Param('userId') userId: string) {
    return await this.adminService.banUsers(userId)
  }
}